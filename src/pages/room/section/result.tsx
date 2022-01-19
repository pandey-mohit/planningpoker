import React from "react"

import styles from "../style.module.css"


export const Result:React.FC<ResultProps> = ({ participants, showResult, stats }) => {
  return (
    <div className={styles.result}>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Average</h2>
        <div className={styles.circle}>
          <span className={styles.inner}>{showResult && stats.average}</span>
        </div>
      </div>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Voted</h2>
        <div className={styles.circle}>
          <span className={styles.inner}>{ showResult && `${stats.voted} / ${Object.keys(participants).length}`}</span>
        </div>
      </div>
    </div>
  )
}