import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Workspace from './pages/Workspace.jsx'
import Home from './pages/Home.jsx'
import { InputProvider } from './context/inputContext.jsx'


const Routers = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/work",
    element:
      <InputProvider>
        <Workspace />
      </InputProvider>
  },

  {
    path: "/work/:workId",
    element:
      <InputProvider>
        <Workspace />
      </InputProvider>
  }

])


createRoot(document.getElementById('root')).render(
  <RouterProvider router={Routers}>
    <Home />
  </RouterProvider>
)
