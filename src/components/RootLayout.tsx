import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '@/hooks'
import { initializeAuth } from '@/store/authSlice'

export default function RootLayout() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth())
  }, [dispatch])

  return <Outlet />
}
