import { useEffect } from 'react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  message: string
  onClose: () => void
  duration?: number
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    console.log('Alert component mounted:', { type, message })
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose, type, message])

  const getAlertStyles = () => {
    return 'border-2 border-black bg-white text-black rounded-none'
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  console.log('Rendering Alert:', { type, message })

  return (
    <div
      className={`${getAlertStyles()} px-6 py-4 flex items-center justify-between gap-4 min-w-[300px] max-w-md transition-all duration-300 animate-in`}
      role="alert"
      style={{ display: 'flex' }}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <p className="text-sm font-medium tracking-wide uppercase">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-black hover:text-white transition-all duration-300 border border-transparent hover:border-black"
        aria-label="Cerrar alerta"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default Alert

