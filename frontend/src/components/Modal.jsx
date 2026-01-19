import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

/**
 * Modal component with backdrop and content area
 * Implements Framer Motion animations for open/close
 * Includes focus trap for accessibility
 * Handles ESC key and backdrop click to close
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Optional modal title
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 */
const Modal = ({ isOpen, onClose, children, title, size = 'md' }) => {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus()
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll
      document.body.style.overflow = ''

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    // Handle ESC key
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (event) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  const handleBackdropClick = (event) => {
    // Only close if clicking the backdrop itself, not its children
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const backdropVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }

  const modalVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 }
      }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizeClasses[size]} bg-gray-800 rounded-lg shadow-xl overflow-hidden`}
            tabIndex={-1}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-white"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4">
              {children}
            </div>

            {/* Close button if no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
