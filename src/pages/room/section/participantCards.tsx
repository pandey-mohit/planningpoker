import React from "react"
import { FlipCard } from "../../../components/flipcard"

import styles from "../style.module.css"


export const ParticipantCards:React.FC<ParticipantCardsProps> = ({ list, show }) => {
  return (
    <div className={styles.participants}>
      { Object.keys(list).map(item => <ParticipantCard key={item} uuid={item} item={list[item]} show={show} />) }
    </div>
  )
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ uuid, item, ...restProps }) => {
  const { name, value } = item
  // const arr = uuid.split("-")
  // const name = arr.slice(0, arr.length - 5).join("-")
  return (
    <FlipCard name={name} voted={!!value} {...restProps}>
      <div>{value}</div>
    </FlipCard>
  )
}