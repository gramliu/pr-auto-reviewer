/*global chrome*/
import React from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Popup from "./components/Popup"

const App = () => {
  return <RouterProvider router={router} />
}

export default App

const router = createBrowserRouter([
  {
    // Popup
    path: "/index.html",
    element: <Popup />,
  },
])
