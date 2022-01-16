import React, { useEffect, useState, useReducer } from "react"
import { useParams } from "react-router-dom"

import { register } from "../../pubnub"
import { Deck } from "../../components/deck"
import { ParticipantCards } from "./section/participantCards"
import { Result } from "./section/result"
import { TaskBar } from "./section/taskbar"
import styles from "./style.module.css"


export const Room: React.FC<RoomProps> = ({ user }) => {
  const { roomId = "" } = useParams()
  const { pubnub } = register(user.userName)
  const uuid = localStorage.getItem("uuid")

  let [room, setRoom] = useState({ name: "", owner: "" })
  let [taskValue, setTaskValue] = useState("")
  let [showResult, setShowResult] = useState<boolean | undefined>(undefined)
  let [stats, setStats] = useState<StatsProps>({})
  
  let [participants, dispatch] = useReducer((prevState:ParticipantProps, action:ParticipantAction) => {
    const { type, obj } = action
    switch (type) {
      case "add":
        return { ...prevState, ...obj }
      case "reset":
        let state = { ...prevState }
        Object.keys(state).forEach(i => state[i] = "")
        return state
      default:
        return prevState
    }
  }, {})

   // component did mount
   useEffect(() => {
    pubnub.subscribe({
      channels: [roomId],
      withPresence: true
    })
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
        // includeState: true,
        includeUUIDs: true
      }, (status, response) => {
        const { occupants } = response.channels[roomId]
        let obj = occupants.reduce((accum:object, curr) => ({ ...accum, [`${curr.uuid}`]: "" }), {})
        dispatch({ type: "add", obj })
      }
    )
  }, [])

  // effect to check showResult change to update the stats
  useEffect(() => {
    if(showResult) {
      let arr = []
      // let unanwsered = 0
      for (const [key, value] of Object.entries(participants)) {
        if(value) {
          if (isNaN(Number(value))) {
            // unanwsered += 0
          } else {
            arr.push(Number(value))
          }
        }
      }
      setStats({
        average: arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0,
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
  const handlePresence = (event: any) => {
    const { action, uuid } = event
    if(action === "join") {
      dispatch({ type: "add", obj: { [uuid]: "" } })
    }
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
      message: { action: "vote", value, uuid}
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