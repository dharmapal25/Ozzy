import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Workspace from './pages/Workspace.jsx'
import Home from './pages/Home.jsx'
import { InputProvider } from './context/inputContext.jsx'
import { WorkProvider } from './context/workContext.jsx'


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

    <WorkProvider>

      <InputProvider>
        <Workspace />
      </InputProvider>

    </WorkProvider>
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
