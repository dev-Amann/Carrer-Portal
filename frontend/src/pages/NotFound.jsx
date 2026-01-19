import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * NotFound page - 404 error page with link back to home
 * Requirements: 1.4
 */
const NotFound = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="not-found-page min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        {/* 404 Illustration */}
        <motion.div
          className="mb-8"
          initial={{ scale: prefersReducedMotion ? 1 : 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
        >
          <div className="text-9xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-100 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className="text-xl text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.4 }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.5 }}
        >
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            Go to Home
          </Link>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gray-800 text-gray-100 font-semibold rounded-lg border-2 border-gray-600 hover:border-blue-400 transition-colors duration-300"
          >
            Contact Support
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.6 }}
        >
          <p className="text-gray-400 mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/services"
              className="text-blue-400 hover:underline"
            >
              Services
            </Link>
            <Link
              to="/portfolio"
              className="text-blue-400 hover:underline"
            >
              Portfolio
            </Link>
            <Link
              to="/about"
              className="text-blue-400 hover:underline"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="text-blue-400 hover:underline"
            >
              Blog
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
