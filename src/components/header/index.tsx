import React from "react"
import { PrimaryButton } from "@fluentui/react"
import styles from "./style.module.css"
import { NewRoom } from "../newroom"
import { useBoolean } from '@fluentui/react-hooks'

export const Header: React.FC = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  return (
    <header className={styles.header}>
      <span className={`ms-fontSize-28 ${styles.heading}`}>Scrum Pokermon</span>
      <span className={styles.filler}></span>
      <PrimaryButton onClick={toggleHideDialog}>Start new room</PrimaryButton>
      <NewRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog} />
    </header>
  )
}