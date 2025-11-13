import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import RootLayout from './components/RootLayout'
import ProtectedRootLayout from './components/ProtectedRootLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        element: <ProtectedRootLayout />,
        children: [
          {
            path: 'home',
            element: <Home />,
          },
        ],
      },
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
    ],
  },
])
