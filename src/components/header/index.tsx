import React from "react"
import { matchPath } from "react-router-dom"
import { PrimaryButton } from "@fluentui/react"
import styles from "./style.module.css"
import { CreateRoom } from "../createroom"
import { useBoolean } from '@fluentui/react-hooks'

const RightNav: React.FC = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)
  return (
    <>
      <PrimaryButton onClick={toggleHideDialog}>Start new room</PrimaryButton>
      <CreateRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog} />
    </>
  )
}

export const Header: React.FC = () => {
  const roomPage = matchPath("/room/:roomId", location.pathname)
  return (
    <header className={styles.header}>
      <span className={`ms-fontSize-28 ${styles.heading}`}>Scrum Pokermon</span>
      <span className={styles.filler}></span>
      { roomPage && <RightNav /> }
    </header>
  )
}