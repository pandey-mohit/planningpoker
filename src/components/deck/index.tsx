import React from "react"

import CARDS from "./cards.json"
import styles from "./style.module.css"

interface CardProps {
  value: string
  selected: boolean
  disabled?: boolean
  onClick: (value: string) => void
}

interface DeckProps {
  value: string | undefined
  disabled?: boolean
  onClick: (value: string) => void
}

const Card: React.FC<CardProps> = ({ disabled = true, selected, value, onClick }) => {
  return (
    <div className={`${styles.card} ${disabled && styles.disabled} ${selected && styles.selected}`} onClick={() => !disabled && onClick(value)}>
      <div className={styles.container}>
        <span>{value}</span>
      </div>
    </div>
  )
}


export const Deck: React.FC<DeckProps> = ({ disabled, value, onClick }) => {
  const cards = CARDS.map(i => {
    i.selected = i.value === value ? true : false
    return i
  })
  return (
    <div>
      <h2 className={styles.heading}>Cast your vote from here</h2>
      <div className={styles.deck}>
        { cards.map((item, index) => <Card key={index} disabled={disabled} {...item} onClick={onClick} />)}
      </div>
    </div>
  )
}