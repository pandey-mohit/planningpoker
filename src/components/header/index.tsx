import React from "react"
import { useParams } from "react-router-dom"
import { PrimaryButton } from "@fluentui/react"
import styles from "./style.module.css"
import { CreateRoom } from "../createroom"
import { useBoolean } from '@fluentui/react-hooks'

export const Header: React.FC = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)
  const { roomId } = useParams()
  console.log(useParams())
  return (
    <header className={styles.header}>
      <span className={`ms-fontSize-28 ${styles.heading}`}>Scrum Pokermon</span>
      <span className={styles.filler}></span>
      { roomId && (
      <>
        <PrimaryButton onClick={toggleHideDialog}>Start new room</PrimaryButton>
        <CreateRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog} />
      </>
      )}
    </header>
  )
}