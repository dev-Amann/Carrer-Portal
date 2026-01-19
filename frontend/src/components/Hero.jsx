import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Hero component - landing section with heading, subtitle, and CTAs
 * Requirements: 22.1, 22.2, 22.3, 22.4, 22.5
 */
const Hero = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Animation variants for entrance animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: 'easeOut'
      }
    }
  };

  const handleGetQuote = () => {
    navigate('/contact');
  };

  const handleOurWork = () => {
    navigate('/portfolio');
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          variants={itemVariants}
        >
          <span className="block">CarrerPortal</span>
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Skill-Based Career Recommendation
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Discover your ideal career path with AI-powered recommendations based on your unique skills. 
          Connect with industry experts, bridge skill gaps, and accelerate your professional growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          variants={itemVariants}
        >
          {/* Primary CTA */}
          <button
            onClick={handleGetQuote}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-offset-gray-900"
            aria-label="Get a quote for our services"
          >
            Get a Quote
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleOurWork}
            className="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white text-lg font-semibold rounded-lg border-2 border-gray-600 hover:border-blue-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-offset-gray-900"
            aria-label="View our portfolio"
          >
            Our Work
          </button>
        </motion.div>

        {/* Optional: Scroll indicator */}
        <motion.div
          className="mt-16 hidden md:block"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-sm mb-2">Scroll to explore</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
