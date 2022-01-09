import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { DefaultButton, PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"

import { register } from "../../pubnub"
import { Deck } from "../../components/deck"
import { FlipCard } from "../../components/flipcard"
import styles from "./style.module.css"

const { pubnub } = register()

const Room: React.FC = (props) => {
  const { roomId = "" } = useParams()

  const handleMessage = (event: any) => {
    const message = event.message
    console.log("message received: ", message)
  }

  const sendMessage = (message: any) => {
    pubnub.publish({ channel: roomId.toString(), message })
  }

  if(roomId) {
    pubnub.subscribe({
      channels: [roomId]
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
    pubnub.addListener({ message: handleMessage })
  }

  const [selected, setSelected] = useState("")
  const handleClick = (value: string) => {
    setSelected(value)
  }

  const [toggle, setToggle] = useState(false)
  const onClick = () => {
    setToggle(!toggle)
  }

  return (
    <main className={styles.room}>
      <div className={styles.panel}>
        <TextField className={styles.input} placeholder="Enter task details" errorMessage="" />
        <DefaultButton>Start Voting</DefaultButton>
      </div>
      <div className={styles.filler}>
        <FlipCard toggle={toggle} onClick={onClick}>
          <div>2</div>
        </FlipCard>
      </div>
      <Deck value={selected} onClick={handleClick} />
    </main>
  )
}

export default Room