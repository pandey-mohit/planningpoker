import React, { useEffect, useState } from "react"
import { Link, matchPath, useLocation } from "react-router-dom"

import { LeftNav, RightNav } from "./navBar"
import styles from "./style.module.css"


export const Header: React.FC = () => {
  let location = useLocation()
  const [roomRoute, matchRoomRoute] = useState(matchPath("/room/:roomId", location.pathname))

  useEffect(() => {
    matchRoomRoute(matchPath("/room/:roomId", location.pathname))
  }, [location])

  return (
    <header className={styles.header}>
      <span className={`ms-fontSize-28 ${styles.heading}`}>Scrum Pokermon</span>
      <LeftNav />
      { roomRoute && <RightNav /> }
    </header>
  )
}