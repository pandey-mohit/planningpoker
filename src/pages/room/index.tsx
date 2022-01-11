import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DefaultButton, PrimaryButton } from "@fluentui/react"
import { useBoolean } from "@fluentui/react-hooks"
import { TextField } from "@fluentui/react/lib/TextField"
import { Text } from "@fluentui/react/lib/Text"

import { register } from "../../pubnub"
import { Deck } from "../../components/deck"
import { FlipCard } from "../../components/flipcard"
import styles from "./style.module.css"
import { JoinRoom } from "../../components/joinroom"
import PubNub from "pubnub"

interface User {
  userName?: string
  enterAs?: string
}

const Page: React.FC = () => {
  const { roomId = "" } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<User>({})
  const [isValidRoom, setValidRoom] = useState(true)

  useEffect(() => {
    if(!roomId || !Number(roomId)) {
      return setValidRoom(false)
    }
    
    const user = localStorage.getItem("user")
    setUser(JSON.parse(user || "{}"))
  }, [])

  if(!isValidRoom) {
    navigate("/")
    return null
  }

  return (
    <>
      { user.userName ? <Room user={user} /> : <Login /> }
    </>
  )
}

const Login = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false)
  return (
    <JoinRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog} />
  )
}

interface RoomProps {
  user: User
}
// interface Room {
//   name: string
//   owner: string
// }
const Room: React.FC<RoomProps> = ({ user }) => {
  const { roomId = "" } = useParams()
  const { pubnub } = register(user.userName)

  let [room, setRoom] = useState({ name: "", owner: "" })
  let [participants, setParticipants] = useState<string[]>([])
  let [votingInProgess, setVotingInProgress] = useState(false)

  
  let [task, setTask] = useState({ value: "", error: "" })
  const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setTask({
      ...task,
      value: newValue || ""
    })
  }

  const handleMessage = (event: any) => {
    const message = event.message
    console.log("message received: ", message)
  }

  const handlePresence = (event: any) => {
    const { action, uuid } = event
    if(action === "join") {
      setParticipants(participants.concat([uuid]))
    }
  }

  const [showResult, setShowResult] = useState(false)
  const startVoting = () => {
    console.log("***")
    if(!task.value) {
      return setTask({ ...task, error: "Please enter the task details" })
    }
    setTask({ ...task, error: "" })
    setVotingInProgress(true)
    setShowResult(false)

    // send message
    pubnub.publish({
      channel: roomId.toString(),
      message: {
        action: "start",
        task: task.value
      }
    })
  }

  const endVoting = () => {
    setTask({ value: "", error: "" })
    setVotingInProgress(false)
    setShowResult(true)
  }

  // component did mount
  useEffect(() => {
    if(roomId) {
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
          const channelName = name
        }
      })
      pubnub.addListener({ message: handleMessage, presence: handlePresence})
      pubnub.hereNow({
          channels: [roomId],
          // includeState: true,
          includeUUIDs: true
        }, (status, response) => {
          const { occupants } = response.channels[roomId]
          setParticipants(occupants.map(i => i.uuid))
        }
      )

      // send message
      // sendMessage({ value: 2, user: "test" })
    }
  }, [])

  const [selected, setSelected] = useState("")
  const handleClick = (value: string) => {
    setSelected(value)
  }

  // console.log(participants)
  return (
    <main className={styles.room}>
      <div className={styles.panel}>
        <TextField
          className={styles.input}
          placeholder="Enter task details"
          disabled={votingInProgess}
          errorMessage={task.error}
          value={task.value}
          onChange={onInputChange}
        />
        <DefaultButton disabled={votingInProgess} onClick={startVoting}>Start Voting</DefaultButton>
        &nbsp;&nbsp;
        <PrimaryButton disabled={!votingInProgess} onClick={endVoting}>End Voting</PrimaryButton>
      </div>
      <div className={styles.filler}>
        <div className={styles.participants}>
          { participants.map(item => <ParticipantCards key={item} uuid={item} show={showResult} />) }
        </div>
        <div className={styles.result}>
          <div>
            <h2 className={styles.heading}>Average</h2>
            <div className="circle">
              <span className="inner">8</span>
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>Vote</h2>
            <div className="circle">
              <span className="inner">8 / 10</span>
            </div>
          </div>
        </div>
      </div>
      <Deck value={selected} onClick={handleClick} />
    </main>
  )
}

interface ParticipantCardsProps {
  uuid: string,
  show: boolean
}
const ParticipantCards: React.FC<ParticipantCardsProps> = ({ uuid, ...restProps }) => {
  const arr = uuid.split("-")
  const name = arr.slice(0, arr.length - 5).join("-")
  return (
    <FlipCard name={name} {...restProps}>
      <div>2</div>
    </FlipCard>
  )
}

export default Page