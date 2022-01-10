import React from "react"
import styles from "./style.module.css"
import "./pokeball.css"

interface Props {
  flip?: boolean,
  toggle?: boolean,
  name?: string,
  onClick?: () => void
  children: JSX.Element | JSX.Element[]
}

export const FlipCard: React.FC<Props> = ({ children, flip=true, name, toggle, onClick }) => {
  return (
    <div className={`${styles.card} ${flip && toggle && styles.toggle}`} onClick={onClick}>
      <div className={styles.content}>
        <div className={styles.front}>
          {/* <div className="pokeball">
            <div className="pokeball-button"></div>
          </div> */}
        </div>
        <div className={styles.back}>
          { children }
        </div>
      </div>
      <div className={styles.name}>{name}</div>
    </div>
  )
}