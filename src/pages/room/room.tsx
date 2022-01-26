import React, { useEffect, useState, useReducer } from "react"
import { useParams } from "react-router-dom"

import { register } from "../../pubnub"
import { Deck } from "../../components/deck"
import { ParticipantCards } from "./section/participantCards"
import { Result } from "./section/result"
import { TaskBar } from "./section/taskbar"
import styles from "./style.module.css"

// participant reducer
const reducer = (uuid:string) => {
  return (prevState:ParticipantProps, action:ParticipantAction) => {
    const { type, obj } = action
    let state = { ...prevState }
    switch (type) {
      case "add":
        return { ...state, ...obj }
      case "leave":
        let id = ((obj || {}).uuid).toString()
        if(id && id !== uuid) {
          delete state[id]
        }
        return state
      case "reset":
        Object.keys(state).forEach(i => state[i] = { ...state[i], value: "" })
        return state
      default:
        return state
    }
  }
}

export const Room: React.FC = () => {
  const { roomId = "" } = useParams()
  const { pubnub } = register()
  const uuid = localStorage.getItem("uuid") || ""

  let [user, setUser] = useState<User>({})
  let [room, setRoom] = useState({ name: "", owner: "" })
  let [taskValue, setTaskValue] = useState("")
  let [showResult, setShowResult] = useState<boolean | undefined>(undefined)
  let [stats, setStats] = useState<StatsProps>({})
  
  let [participants, dispatch] = useReducer(reducer(uuid), {})

  const getUser = async () => {
    let { data } = await pubnub.objects.getUUIDMetadata()
    let { name, custom } = data
    setUser({
      userName: (name || "").toString(),
      enterAs: custom ? custom.enterAs.toString() : "participant"
    })
  }

  // component did mount
  useEffect(() => {
    pubnub.subscribe({
      channels: [roomId],
      withPresence: true
    })

    // get user details
    getUser()
    
    pubnub.objects.getChannelMetadata({
      channel: roomId
    }).then(({ status, data }) => {
      if(status === 200) {
        let { name, custom } = data
        let { owner = "" } = custom || {}
        setRoom({
          name: name || "",
          owner: owner.toString()
        })
      }
    })
  
    pubnub.addListener({ message: handleMessage, presence: handlePresence })
    pubnub.hereNow({
      channels: [roomId],
      includeUUIDs: true,
      includeState: true
    }, (status, response) => {
      const { occupants } = response.channels[roomId]
      let obj = {} as ParticipantProps
      (async () => {
        for(let i = 0;  i < occupants.length; i++) {
          let { uuid = "" } = occupants[i]
          let { status, data } = await pubnub.objects.getUUIDMetadata({ uuid })
          obj[uuid] = {
            name: status === 200 ? (data.name || "") : "",
            value: ""
          }
          dispatch({ type: "add", obj })
        }
      })()
    })

    // add unload event
    window.addEventListener("beforeunload", (onUnload))
    return () => {
      onUnload()
      window.removeEventListener("beforeunload", onUnload)
    }
  }, [])

  // effect to check showResult change to update the stats
  useEffect(() => {
    if(showResult) {
      let arr = []
      // let unanwsered = 0
      for (const [key, { value }] of Object.entries(participants)) {
        if(value) {
          if (isNaN(Number(value))) {
            // unanwsered += 0
          } else {
            arr.push(Number(value))
          }
        }
      }
      setStats({
        average: arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) * 10 / arr.length) / 10 : 0,
        voted: arr.length
      })
    }
  }, [showResult])

  // on new message received
  const handleMessage = (event: any) => {
    const message = event.message
    const { action, task, value, uuid } = message
    if (action === "start" ) {
      setTaskValue(task)
      setShowResult(false)
      setMyVote("")
      dispatch({ type: "reset" })
    }
    if (action === "vote") {
      dispatch({ type: "add", obj: { [uuid]: value } })
    }
    if (action === "end") {
      setShowResult(true)
    }
  }

  // on presence event
  const handlePresence = async (event: any) => {
    const { action, uuid } = event
    let { data } = await pubnub.objects.getUUIDMetadata({ uuid })
    switch( action) {
      case "join":
        // TODO - MOHIT PANDEY
        return dispatch({ type: "add", obj: { [uuid]: { name: (data.name || "").toString(), value: "" } } })
      case "leave":
        return dispatch({ type: "leave", obj: { uuid: uuid } })
    }
  }

  const onUnload = () => {
    pubnub.unsubscribe({ channels: [roomId] })
  }

  // start voting
  const onStartVoting = (task: string) => {
    setShowResult(false)
    pubnub.publish({
      channel: roomId.toString(),
      message: { action: "start", task: task }
    })
  }

  // end voting
  const onEndVoting = (task: string) => {
    setShowResult(true)
    pubnub.publish({
      channel: roomId.toString(),
      message: { action: "end", task: task }
    })
  }

  // cast vote
  const [myVote, setMyVote] = useState("")
  const onVote = (value: string) => {
    setMyVote(value)
    pubnub.publish({
      channel: roomId.toString(),
      message: { action: "vote", uuid: uuid, value: { name: user.userName, value: value }}
    })

  }
  
  return (
    <main className={styles.room}>
      <TaskBar room={room} user={user} value={taskValue} onStartVoting={onStartVoting} onEndVoting={onEndVoting} />
      <div className={styles.filler}>
        <ParticipantCards list={participants} show={showResult} />
        <Result participants={participants} showResult={showResult} stats={stats} />
      </div>
      { <Deck disabled={showResult === undefined ? true : showResult} value={myVote} onClick={onVote} /> }
    </main>
  )
}