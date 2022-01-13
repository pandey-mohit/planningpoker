import React, { useEffect, useState, useReducer } from "react"
import { useParams } from "react-router-dom"
import { DefaultButton, PrimaryButton, values } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"

import { register } from "../../pubnub"
import { Deck } from "../../components/deck"
import { FlipCard } from "../../components/flipcard"
import styles from "./style.module.css"


interface User {
  userName?: string
  enterAs?: string
}

interface RoomProps {
  user: User
}

interface ParticipantProps {
  [key: string]: string
}

// type ParticipantProps =  Record<string, string>
interface ParticipantAction {
  type: string
  obj?: ParticipantProps
}

interface StatsProps {
  average?: number
  voted?: number
}

export const Room: React.FC<RoomProps> = ({ user }) => {
  const { roomId = "" } = useParams()
  const { pubnub } = register(user.userName)
  const uuid = localStorage.getItem("uuid")


  let [room, setRoom] = useState({ name: "", owner: "" })
  let [task, setTask] = useState({ value: "", error: "" })
  // let [participants, setParticipants] = useState<ParticipantProps>({})
  let [votingInProgress, setVotingInProgress] = useState(false)
  let [showResult, setShowResult] = useState(false)
  let [stats, setStats] = useState<StatsProps>({})
  let [participants, dispatch] = useReducer((state:ParticipantProps, action:ParticipantAction) => {
    // console.log(state, action)
    const { type, obj } = action
    switch (type) {
      case "add":
        return { ...state, ...obj }
      case "reset":
        Object.keys(state).forEach(i => state[i] = "")
        return state
      default:
        return state
    }
  }, {})
  
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

  const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setTask({
      ...task,
      value: (newValue || "").toUpperCase()
    })
  }

  // on new message received
  const handleMessage = (event: any) => {
    const message = event.message
    const { action, task, value, uuid } = message
    if (action === "start" ) {
      setTask({ value: task, error: "" })
      setVotingInProgress(true)
      setShowResult(false)
      setSelected("")
      dispatch({ type: "reset" })
      // setParticipants(prev => {
      //   Object.keys(prev).forEach(i => prev[i] = "")
      //   return prev
      // })
    }
    if (action === "vote" ) {
      dispatch({ type: "add", obj: { [uuid]: value } })
      // setParticipants(prev => ({ ...prev, ...({ [uuid]: value })}))
    }
    if (action === "end") {
      setVotingInProgress(false)
      setShowResult(true)
    }
    console.log("message received: ", message)
  }

  // on presence event
  const handlePresence = (event: any) => {
    const { action, uuid } = event
    if(action === "join") {
      dispatch({ type: "add", obj: { [uuid]: "" } })
      // setParticipants(prev => ({ ...prev, ...({ [uuid]: "" })}))
    }
  }

  // start voting
  const startVoting = () => {
    if(!task.value) {
      return setTask({ ...task, error: "Please enter the task details" })
    }
    setTask({ ...task, error: "" })
    setVotingInProgress(true)
    setShowResult(false)

    // send message
    pubnub.publish({
      channel: roomId.toString(),
      message: { action: "start", task: task.value }
    })
  }

  // end voting
  const endVoting = () => {
    setTask({ value: "", error: "" })
    setVotingInProgress(false)
    setShowResult(true)

    // send message
    pubnub.publish({
      channel: roomId.toString(),
      message: { action: "end", task: task.value }
    })
  }

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
        console.log("Channel meta data: ", data)
        let { name, custom } = data
        let { owner = "" } = custom || {}
        setRoom({
          name: name || "",
          owner: owner.toString()
        })
      }
    })
    pubnub.addListener({ message: handleMessage, presence: handlePresence})
    pubnub.hereNow({
        channels: [roomId],
        // includeState: true,
        includeUUIDs: true
      }, (status, response) => {
        const { occupants } = response.channels[roomId]
        let obj = occupants.reduce((accum:object, curr) => ({ ...accum, [`${curr.uuid}`]: "" }), {})
        // setParticipants(obj)
        dispatch({ type: "add", obj })
      }
    )
  }, [])

  // cast vote
  const [selected, setSelected] = useState("")
  const castVote = (value: string) => {
    setSelected(value)
    pubnub.publish({
      channel: roomId.toString(),
      message: { action: "vote", value, uuid}
    })

  }

  return (
    <main className={styles.room}>
      <div className={styles.panel}>
        <h2 className={styles.myroom}>
          { room.name }
          { user.enterAs !== "host" && <span className={styles.owner}> (created by: {room.owner})</span>}  
        </h2>
        { user.enterAs !== "host" ? (
            <span className={styles.task}>Task: {task.value}</span>
          ) : (
            <>
              <TextField
                className={styles.input}
                placeholder="Enter task details"
                disabled={votingInProgress}
                errorMessage={task.error}
                value={task.value}
                onChange={onInputChange}
              />
              <DefaultButton disabled={votingInProgress} onClick={startVoting}>Start Voting</DefaultButton>
              &nbsp;&nbsp;
              <PrimaryButton disabled={!votingInProgress} onClick={endVoting}>End Voting</PrimaryButton>
            </>
          )
        }
      </div>
      <div className={styles.filler}>
        <div className={styles.participants}>
          { Object.keys(participants).map(item => <ParticipantCards key={item} uuid={item} value={participants[item]} show={showResult} />) }
        </div>
        <div className={styles.result}>
          <div>
            <h2 className={styles.heading}>Average</h2>
            <div className="circle">
              <span className="inner">{showResult && stats.average}</span>
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>Voted</h2>
            <div className="circle">
              <span className="inner">{ showResult && `${stats.voted} / ${Object.keys(participants).length}`}</span>
            </div>
          </div>
        </div>
      </div>
      { <Deck disabled={!votingInProgress} value={selected} onClick={castVote} /> }
    </main>
  )
}

interface ParticipantCardsProps {
  uuid: string,
  value: string,
  show: boolean
}
const ParticipantCards: React.FC<ParticipantCardsProps> = ({ uuid, value, ...restProps }) => {
  const arr = uuid.split("-")
  const name = arr.slice(0, arr.length - 5).join("-")
  return (
    <FlipCard name={name} {...restProps} voted={!!value}>
      <div>{value}</div>
    </FlipCard>
  )
}