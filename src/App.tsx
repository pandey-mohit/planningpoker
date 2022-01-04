import React, { useState } from "react"
import { DocumentCard } from "@fluentui/react/lib/DocumentCard"
import { PrimaryButton } from "@fluentui/react"
import { TodoList } from "./components/TodoList"
import { AddTodoForm } from "./components/AddTodoForm"
import { Header } from "./components/header/index"

const initialTodos: Todo[] = [
  {
    text: 'Walk the dog',
    complete: false,
  },
  {
    text: 'Write app',
    complete: true,
  },
]

function App() {
  const [todos, setTodos] = useState(initialTodos)
  const toggleTodo = (selectedTodo: Todo) => {
    const newTodos = todos.map((todo) => {
      if (todo === selectedTodo) {
        return {
          ...todo,
          complete: !todo.complete,
        }
      }
      return todo
    })
    setTodos(newTodos)
  }

  const addTodo: AddTodo = (text: string) => {
    const newTodo = { text, complete: false }
    setTodos([...todos, newTodo])
  }

  return (
    <>
      <Header />
      <main>
        {/* <div className="filler"></div> */}
        <div className="banner">
          <h1 className="ms-fontSize-42">Set up your planning poker for agile development</h1>
          <PrimaryButton>Join room</PrimaryButton>
          <PrimaryButton>Start new room</PrimaryButton>
        </div>
        {/* <div className="filler"></div> */}
        {/* <TodoList todos={todos} toggleTodo={toggleTodo} />
        <AddTodoForm addTodo={addTodo} /> */}
      </main>
    </>
  )
}

export default App