import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

export default function ProtectedRootLayout() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  if (isLoading) {
    return null // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
