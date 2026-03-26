import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

/**
 * NotFound page - 404 error page with link back to home
 * Requirements: 1.4
 */
const NotFound = () => {
  return (
    <div className="not-found-page min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
      <div className="text-center max-w-2xl relative z-10">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-indigo-200">
            404
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-xl text-slate-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
          >
            Go to Home
          </Link>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-500 mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/about"
              className="text-indigo-600 hover:underline"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
