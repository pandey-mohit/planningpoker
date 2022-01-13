import React from "react"
import { useBoolean } from "@fluentui/react-hooks"
import { JoinRoom } from "../../components/joinroom"

export const Login = () => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false)
  return (
    <JoinRoom hideDialog={hideDialog} toggleHideDialog={toggleHideDialog} />
  )
}