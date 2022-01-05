import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { initializeIcons } from "@fluentui/font-icons-mdl2"
import Landing from "./pages/landing"
import Room from "./pages/Room"
import { Header } from "./components/header"
import { Footer } from "./components/footer"

// initialize icons
initializeIcons()

function Main() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default Main