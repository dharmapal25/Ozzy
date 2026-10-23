import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Workspace from './pages/Workspace.jsx'
import { InputProvider } from './context/inputContext.jsx'
import { WorkProvider } from './context/WorkContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { RequireAuth, RequireGuest } from './components/AuthRoutes.jsx'


const Routers = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/work" replace />
  },
  {
    path: "/login",
    element: <RequireGuest><Login /></RequireGuest>
  },

  {
    path: "/work",
    element: <RequireAuth>

    <WorkProvider>

      <InputProvider>
        <Workspace />
      </InputProvider>

    </WorkProvider>
    </RequireAuth>
  },

  {
    path: "/work/:workId",
    element: <RequireAuth>
      <WorkProvider>
        <InputProvider>
          <Workspace />
        </InputProvider>
      </WorkProvider>
    </RequireAuth>
  }

])


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={Routers} />
  </AuthProvider>
)
