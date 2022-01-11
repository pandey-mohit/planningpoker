import React from "react"
import styles from "./style.module.css"
import "./pokeball.css"

interface Props {
  show: boolean,
  name?: string,
  onClick?: () => void
  children: JSX.Element | JSX.Element[]
}

export const FlipCard: React.FC<Props> = ({ children, name, show, onClick }) => {
  return (
    <div className={`${styles.card} ${show ? styles.show : ""}`}>
      <div className={styles.content} onClick={onClick}>
        <div className={styles.front}>
          {/* <div className="pokeball">
            <div className="pokeball-button"></div>
          </div> */}
        </div>
        <div className={styles.back}>
          { children }
        </div>
      </div>
      { name && <div className={styles.name}>{name}</div> }
    </div>
  )
}