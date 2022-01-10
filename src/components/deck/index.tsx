import { Text } from "@fluentui/react"
import React from "react"

import CARDS from "./cards.json"
import styles from "./style.module.css"

interface CardProps {
  value: string
  selected: boolean
  onClick: (value: string) => void
}

interface DeckProps {
  value: string | undefined
  onClick: (value: string) => void
}

const Card: React.FC<CardProps> = ({ selected, value, onClick }) => {
  return (
    <div className={`${styles.card} ${selected && styles.selected}`} onClick={() => { onClick(value) }}>
      <div className={styles.container}>
        <span>{value}</span>
      </div>
    </div>
  )
}


export const Deck: React.FC<DeckProps> = ({ value, onClick }) => {
  const cards = CARDS.map(i => {
    i.selected = i.value === value ? true : false
    return i
  })
  return (
    <div>
      <p className="ms-fontSize-24" style={{ "textAlign": "center" }}>Cast your vote from here</p>
      <div className={styles.deck}>
        { cards.map((item, index) => <Card key={index} {...item} onClick={onClick} />)}
      </div>
    </div>
  )
}