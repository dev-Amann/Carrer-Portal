import { useState, useEffect } from 'react'

/**
 * Custom hook to detect if user prefers reduced motion
 * Checks the prefers-reduced-motion media query
 * @returns {boolean} true if user prefers reduced motion, false otherwise
 */
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window and matchMedia are available (for SSR compatibility)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Handler for media query changes
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches)
    }

    // Add event listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

export default usePrefersReducedMotion
