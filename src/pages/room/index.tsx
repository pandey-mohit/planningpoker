import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DefaultButton, PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { Text } from "@fluentui/react/lib/Text"

import { register } from "../../pubnub"
import { Deck } from "../../components/deck"
import { FlipCard } from "../../components/flipcard"
import styles from "./style.module.css"

const { pubnub } = register("mohit")

const Room: React.FC = (props) => {
  const { roomId = "" } = useParams()
  let [participants, setParticipants] = useState<string[]>([])

  const handleMessage = (event: any) => {
    const message = event.message
    console.log("message received: ", message)
  }

  const sendMessage = (message: any) => {
    pubnub.publish({ channel: roomId.toString(), message })
  }

  const handlePresence = (event: any) => {
    const { action, uuid } = event
    if(action === "join") {
      setParticipants(participants.concat([uuid]))
    }
    // console.log("&&&& presence &&&: ", event)
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
      }).then(({ status, data}) => {
        if(status === 200) {
          console.log('Channel meta data: ', data)
          const { name, custom } = data
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
          // console.log(occupants.map(i => i.uuid))
          setParticipants(occupants.map(i => i.uuid))
          // console.log("herenow: ", status, response)
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

  const [toggle, setToggle] = useState(false)
  const onClick = () => {
    setToggle(!toggle)
  }
  // console.log(participants)
  return (
    <main className={styles.room}>
      <div className={styles.panel}>
        <TextField className={styles.input} placeholder="Enter task details" errorMessage="" />
        <DefaultButton>Start Voting</DefaultButton>
        &nbsp;&nbsp;
        <PrimaryButton>End Voting</PrimaryButton>
      </div>
      <div className={styles.filler}>
        <div className={styles.participants}>
          { participants.concat(participants).concat(participants).concat(participants).concat(participants).concat(participants).map(item => <ParticipantCards key={item} uuid={item} toggle={toggle} onClick={onClick} />)}
        </div>
        <div className={styles.result}>
          <div>
            <Text variant="large">Average</Text><br />
            <div className="circle">
              <Text className="inner" variant="xxLarge">8</Text>
            </div>
          </div>
          <div>
            <Text variant="large">Vote</Text><br />
            <div className="circle">
              <Text className="inner" variant="xxLarge">8 / 10</Text>
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
  toggle: boolean,
  onClick: () => void
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

export default Room