import React, { useEffect, useState } from "react"
import { DefaultButton, PrimaryButton } from "@fluentui/react"
import { TextField } from "@fluentui/react/lib/TextField"

import styles from "../style.module.css"


export const TaskBar: React.FC<TaskBarProps> = ({ room, user, value, onStartVoting, onEndVoting }) => {
  let [task, setTask] = useState({ value: "", error: "" })
  let [votingInProgress, setVotingInProgress] = useState(false)

  useEffect(() => {
    setTask({ value, error: "" })
  }, [value])
  
  const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setTask({
      ...task,
      value: (newValue || "").toUpperCase()
    })
  }

  // start voting
  const startVoting = () => {
    if(!task.value) {
      return setTask({ ...task, error: "Please enter the task details" })
    }
    setTask({ ...task, error: "" })
    setVotingInProgress(true)
    onStartVoting(task.value)
  }

  // end voting
  const endVoting = () => {
    setTask({ value: "", error: "" })
    setVotingInProgress(false)
    onEndVoting(task.value)
  }

  return (
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
  )
}