import React, { Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createTheme, ThemeProvider } from "@fluentui/react"
import { initializeIcons } from "@fluentui/font-icons-mdl2"
import Landing from "./pages/landing"
import Room from "./pages/room"
import { Header } from "./components/header"
// import { Footer } from "./components/footer"

// initialize icons
initializeIcons()

const myTheme = createTheme({
  palette: {
    themePrimary: '#0a70e3',
    themeLighterAlt: '#f4f9fe',
    themeLighter: '#d4e6fb',
    themeLight: '#b0d1f7',
    themeTertiary: '#65a5ee',
    themeSecondary: '#247fe6',
    themeDarkAlt: '#0864cc',
    themeDark: '#0754ac',
    themeDarker: '#053e7f',
    neutralLighterAlt: '#ffffff',
    neutralLighter: '#ffffff',
    neutralLight: '#ffffff',
    neutralQuaternaryAlt: '#ffffff',
    neutralQuaternary: '#ffffff',
    neutralTertiaryAlt: '#ffffff',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  }})

// lazy loading module
const Error = React.lazy(() => import("./pages/error"))

function Main() {
  return (
    <ThemeProvider applyTo='body' theme={myTheme}>
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
    </ThemeProvider>
  )
}

export default Main
