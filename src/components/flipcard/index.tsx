import React from "react"
import styles from "./style.module.css"

interface Props {
  flip?: boolean,
  toggle?: boolean,
  onClick?: () => void
  children: JSX.Element | JSX.Element[]
}

export const Card: React.FC<Props> = ({ children, flip=true, toggle, onClick }) => {
  return (
    <div className={`${styles.card} ${flip && toggle && styles.toggle}`} onClick={onClick}>
      <div className={styles.content}>
        { children }
      </div>
    </div>
  )
}