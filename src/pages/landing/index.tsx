import React, { useState } from "react"
import { DefaultButton, PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"
import { useBoolean } from '@fluentui/react-hooks'

import { NewRoom } from "../../components/newroom"
import styles from "./style.module.css"

function Landing() {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const handleSubmit = () => {
    console.log("handle submit event")
  }

  return (
    <>
      <div className="banner">
        <h1 className="ms-fontSize-68">Set up your planning poker for agile development</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField className={styles.room} placeholder="Enter Room Id" errorMessage="" />
          <DefaultButton>Join room</DefaultButton>
          <PrimaryButton onClick={toggleHideDialog}>Start new room</PrimaryButton>
        </form>
        <NewRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog}/>
      </div>
    </>
  )
}

export default Landing