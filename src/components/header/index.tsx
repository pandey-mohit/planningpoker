import React, { useEffect, useState } from "react"
import { Link, matchPath, useLocation } from "react-router-dom"

import { NavBar } from "./navBar"
import "./style.css"


export const Header: React.FC = () => {
  let location = useLocation()
  const [roomRoute, matchRoomRoute] = useState(matchPath("/room/:roomId", location.pathname))

  useEffect(() => {
    matchRoomRoute(matchPath("/room/:roomId", location.pathname))
    console.log(roomRoute)
  }, [location])

  return (
    <header className="header">
      <span className="ms-fontSize-28 heading">Scrum Pokermon</span>
      <NavBar rightNav={!!roomRoute} />
    </header>
  )
}