import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Login } from "./login"
import { Room } from "./room"


const Page: React.FC = () => {
  const { roomId = "" } = useParams()
  const navigate = useNavigate()
  // const [user, setUser] = useState<User>({})
  const [isValidRoom, setValidRoom] = useState(true)

  useEffect(() => {
    if(!roomId || !Number(roomId)) {
      return setValidRoom(false)
    }
    
    // const user = localStorage.getItem("uuid")
    // setUser(JSON.parse(user || "{}"))
  }, [])

  if(!isValidRoom) {
    navigate("/")
    return null
  }

  return (
    <>
      { localStorage.getItem("uuid") ? <Room /> : <Login /> }
    </>
  )
}

export default Page