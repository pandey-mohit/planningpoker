import React, { Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { initializeIcons } from "@fluentui/font-icons-mdl2"
import Landing from "./pages/landing"
import Room from "./pages/room"
import { Header } from "./components/header"
// import { Footer } from "./components/footer"

// initialize icons
initializeIcons()

// lazy loading module
const Error = React.lazy(() => import("./pages/error"))

function Main() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="*" element={
          <Suspense fallback={<></>}>
            <Error />
          </Suspense>
        }/>
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default Main
