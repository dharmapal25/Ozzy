import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Workspace from './pages/Workspace.jsx'
import Home from './pages/Home.jsx'


const Routers = createBrowserRouter([
  {
    path : "/",
    element : <App/>
  },
  {
    path : "/login",
    element : <Login/>
  },

  {
    path : "/work",
    element : <Workspace/>
  },

  {
    path : "/work/:workId",
    element : <Workspace/>
  }

])


createRoot(document.getElementById('root')).render(
  <RouterProvider router={Routers}>
    <Home />
  </RouterProvider>
)
