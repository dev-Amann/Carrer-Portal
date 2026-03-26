import { useEffect, useState } from 'react'

/**
 * Toast notification component with success and error variants
 * Auto-dismisses after 5 seconds with manual dismiss option
 * Accessible with ARIA live regions
 * 
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - 'success' or 'error'
 * @param {function} props.onClose - Callback when toast is dismissed
 * @param {number} props.duration - Auto-dismiss duration in ms (default: 5000)
 */
const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      if (onClose) onClose()
    }, 200)
  }

  useEffect(() => {
    setIsVisible(true);
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, message]) // Re-trigger on message change

  if (!isVisible) return null

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: (
        <svg
          className="w-5 h-5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: (
        <svg
          className="w-5 h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )
    }
  }

  const style = typeStyles[type] || typeStyles.success

  return (
    <div
      className="fixed top-4 right-4 z-50 max-w-md transition-opacity duration-300 ease-in-out"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${style.bg} ${style.border}`}
      >
        <div className="flex-shrink-0">
          {style.icon}
        </div>
        <div className={`flex-1 ${style.text}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${style.text} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current rounded`}
          aria-label="Close notification"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast
