import { useState, useEffect } from 'react'

/**
 * Custom hook to detect which section is currently in view
 * Useful for highlighting active navigation links based on scroll position
 * @param {string[]} sectionIds - Array of section IDs to observe
 * @param {number} offset - Offset from top in pixels (default: 100)
 * @returns {string|null} The ID of the currently active section
 */
const useScrollSpy = (sectionIds, offset = 100) => {
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    // Check if window is available (for SSR compatibility)
    if (typeof window === 'undefined') {
      return
    }

    const handleScroll = () => {
      // Get current scroll position
      const scrollPosition = window.scrollY + offset

      // Find the section that is currently in view
      let currentSection = null

      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId)
        
        if (element) {
          const { offsetTop, offsetHeight } = element
          
          // Check if scroll position is within this section
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = sectionId
            break
          }
        }
      }

      // If no section is in view, check if we're at the top
      if (!currentSection && scrollPosition < offset) {
        currentSection = sectionIds[0] || null
      }

      // Update active section if it changed
      if (currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    // Initial check
    handleScroll()

    // Add scroll event listener with throttling
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollListener, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [sectionIds, offset, activeSection])

  return activeSection
}

export default useScrollSpy
