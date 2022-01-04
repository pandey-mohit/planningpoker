import React, { useState } from "react"
import { PrimaryButton } from "@fluentui/react"

interface Props {
  addTodo: AddTodo
}

export const AddTodoForm: React.FC<Props> = ({ addTodo }) => {
  const [text, setText] = useState("")
  return (
    <form>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
      <PrimaryButton
        type="submit"
        onClick={(e) => {
          e.preventDefault()
          addTodo(text)
          setText("")
        }}
      >
        Add Todo
      </PrimaryButton>
    </form>
  )
}