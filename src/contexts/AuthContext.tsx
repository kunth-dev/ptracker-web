import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string } | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
  verifyOTP: (otp: string) => Promise<boolean>
  requestPasswordReset: (email: string) => Promise<boolean>
  resetPasswordWithOTP: (email: string, otp: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation for demo
        if (email && password.length >= 6) {
          setIsAuthenticated(true)
          setUser({ email })
          localStorage.setItem('user', JSON.stringify({ email }))
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const signup = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation for demo
        if (email && password.length >= 6) {
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const verifyOTP = async (otp: string): Promise<boolean> => {
    // Simulate OTP verification
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, accept any 6-digit OTP
        if (otp.length === 6) {
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    // Simulate sending password reset OTP
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email) {
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const resetPasswordWithOTP = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<boolean> => {
    // Simulate password reset with OTP
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && otp.length === 6 && newPassword.length >= 6) {
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('user')
  }

  // Check for existing session on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        verifyOTP,
        requestPasswordReset,
        resetPasswordWithOTP,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
