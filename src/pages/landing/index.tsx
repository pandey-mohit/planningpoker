import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DefaultButton, PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { useBoolean } from '@fluentui/react-hooks'

import { CreateRoom } from "../../components/createroom"
import styles from "./style.module.css"

const Page = () => {
  const navigate = useNavigate()
  let [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)
  let [room, setRoom] = useState({ value: "", error: "" })
  
  const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setRoom({
      ...room,
      value: (newValue || "")
    })
  }

  const joinRoom = () => {
    let { value } = room
    if(value && Number(value)) {
      navigate(`/room/${room.value}`)
    } else {
      setRoom({
        ...room,
        error: "Please eneter a valid room number"
      })
    }
  }

  return (
    <main>
      <div className="banner">
        <h1 className="ms-fontSize-68">Set up your planning poker for agile development</h1>
        <form className={styles.form} >
          <TextField className={styles.room} placeholder="Enter Room Id" errorMessage={room.error} onChange={onInputChange} />
          <DefaultButton onClick={joinRoom}>Join room</DefaultButton>
          <PrimaryButton onClick={toggleHideDialog}>Start new room</PrimaryButton>
        </form>
        <CreateRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog} />
      </div>
    </main>
  )
}

export default Page