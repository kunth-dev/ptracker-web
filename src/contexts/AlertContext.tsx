import React, { createContext, useContext, useState, useCallback } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type AlertVariant = 'default' | 'destructive' | 'success' | 'info'

interface AlertMessage {
  id: string
  title?: string
  description: string
  variant?: AlertVariant
}

interface AlertContextType {
  showAlert: (description: string, title?: string, variant?: AlertVariant) => void
  hideAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider')
  }
  return context
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  const hideAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const showAlert = useCallback((description: string, title?: string, variant: AlertVariant = 'default') => {
    const id = Math.random().toString(36).substring(7)
    const newAlert: AlertMessage = { id, description, title, variant }
    setAlerts((prev) => [...prev, newAlert])
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      hideAlert(id)
    }, 5000)
  }, [hideAlert])

  const getIcon = (variant?: AlertVariant) => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />
      case 'destructive':
        return <AlertCircle className="h-4 w-4" />
      case 'info':
        return <Info className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant === 'success' || alert.variant === 'info' ? 'default' : alert.variant}
            className="shadow-lg animate-in slide-in-from-top-5 pr-12"
          >
            {getIcon(alert.variant)}
            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
            <AlertDescription>{alert.description}</AlertDescription>
            <button
              onClick={() => hideAlert(alert.id)}
              className="absolute top-3 right-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </Alert>
        ))}
      </div>
    </AlertContext.Provider>
  )
}
