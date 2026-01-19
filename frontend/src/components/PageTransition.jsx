import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

/**
 * PageTransition component - wraps page content with fade/slide animations
 * Requirements: 23.4, 2.5, 23.5
 */
const PageTransition = ({ children }) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const pageVariants = {
    initial: prefersReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 0,
          y: 20
        },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: 'easeOut'
      }
    },
    exit: prefersReducedMotion
      ? { opacity: 1 }
      : {
          opacity: 0,
          y: -20,
          transition: {
            duration: 0.2,
            ease: 'easeIn'
          }
        }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
