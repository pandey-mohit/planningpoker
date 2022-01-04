import React, { useState } from "react"
import { PrimaryButton } from "@fluentui/react"
import styles from "./style.module.css"

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <span className={`ms-fontSize-28 ${styles.heading}`}>Scrum Pokermon</span>
      <span className={styles.filler}></span>
      <PrimaryButton>Start Room</PrimaryButton>
    </header>
  )
}