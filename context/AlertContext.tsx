import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Alert, { AlertType } from '@/components/ui/Alert'

interface AlertState {
  id: string
  type: AlertType
  message: string
  duration: number
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string, duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  clearAllAlerts: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

interface AlertProviderProps {
  children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertState[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const clearAllAlerts = () => {
    setAlerts([])
  }

  const showAlert = (type: AlertType, message: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setAlerts((prev) => {
      return [...prev, { id, type, message, duration }]
    })
  }

  const showSuccess = (message: string, duration?: number) => {
    showAlert('success', message, duration)
  }

  const showError = (message: string, duration?: number) => {
    showAlert('error', message, duration)
  }

  const showWarning = (message: string, duration?: number) => {
    showAlert('warning', message, duration)
  }

  const showInfo = (message: string, duration?: number) => {
    showAlert('info', message, duration)
  }

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError, showWarning, showInfo, clearAllAlerts }}>
      {children}
      {/* Contenedor de alerts fijo en la parte superior centrado */}
      {isMounted && (
        <div 
          className="fixed top-4 flex flex-col gap-3 pointer-events-none items-center w-full" 
          style={{ zIndex: 9999, position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)' }}
        >
          {alerts.length > 0 && (
            <>
              {alerts.map((alert) => (
                <div key={alert.id} className="pointer-events-auto">
                  <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => removeAlert(alert.id)}
                    duration={alert.duration}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </AlertContext.Provider>
  )
}

