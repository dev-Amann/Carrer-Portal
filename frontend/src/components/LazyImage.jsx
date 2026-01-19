import { useState } from 'react'

/**
 * LazyImage component with loading="lazy" attribute
 * Displays skeleton placeholder while loading
 * Shows error fallback if image fails to load
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.aspectRatio - Aspect ratio for skeleton (e.g., '16/9', '4/3', '1/1')
 * @param {React.ReactNode} props.fallback - Custom fallback content on error
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = '16/9',
  fallback,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Default fallback component
  const defaultFallback = (
    <div 
      className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{ aspectRatio }}
    >
      <div className="text-center p-4">
        <svg
          className="w-12 h-12 mx-auto text-gray-500 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-gray-400">
          Image failed to load
        </p>
      </div>
    </div>
  )

  // Skeleton placeholder
  const skeleton = (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{ aspectRatio }}
      aria-label="Loading image"
    >
      <div className="flex items-center justify-center h-full">
        <svg
          className="w-10 h-10 text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )

  if (hasError) {
    return fallback || defaultFallback
  }

  return (
    <div className="relative">
      {isLoading && skeleton}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

export default LazyImage
