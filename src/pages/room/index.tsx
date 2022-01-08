import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { DefaultButton, PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { useBoolean } from "@fluentui/react-hooks"

import { Deck } from "../../components/deck"
import styles from "./style.module.css"

const Room: React.FC = (props) => {
  const { roomId } = useParams()
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const handleSubmit = () => {
    console.log("handle submit event")
  }

  const [selected, setSelected] = useState("")
  const handleClick = (value: string) => {
    setSelected(value)
  }

  return (
    <main className={styles.room}>
      <div className={styles.panel}>
        <TextField className={styles.input} placeholder="Enter task details" errorMessage="" />
        <DefaultButton>Start Voting</DefaultButton>
      </div>
      <div className={styles.filler}>

      </div>
      <Deck value={selected} onClick={handleClick} />
      {/* <div className="banner">
        <h1 className="ms-fontSize-68">Set up your planning poker for agile development</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField className={styles.room} placeholder="Enter Room Id" errorMessage="" />
          <DefaultButton>Join room</DefaultButton>
          <PrimaryButton onClick={toggleHideDialog}>Start new room</PrimaryButton>
        </form>
        <CreateRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog}/>
      </div> */}
    </main>
  )
}

export default Room