import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import Button from './ui/Button';

/**
 * ServiceCard component - displays service information with icon, description, and CTA
 * Requirements: 14.2, 14.3
 */
const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleRequestQuote = () => {
    // Navigate to contact page with service pre-selected
    navigate('/contact', { state: { interestedService: service.name } });
  };

  const cardVariants = {
    initial: {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    hover: prefersReducedMotion
      ? {}
      : {
        scale: 1.03,
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      }
  };

  // Icon mapping based on service icon name
  const getIcon = (iconName) => {
    const icons = {
      compass: (
        <svg
          className="w-12 h-12"
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
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
      ),
      'chart-bar': (
        <svg
          className="w-12 h-12"
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      users: (
        <svg
          className="w-12 h-12"
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      'document-text': (
        <svg
          className="w-12 h-12"
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      microphone: (
        <svg
          className="w-12 h-12"
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
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )
    };

    return icons[iconName] || icons.compass;
  };

  return (
    <motion.article
      className="glass-card p-6 h-full flex flex-col"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/20 text-emerald-400">
        {getIcon(service.icon)}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-3">
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-gray-400 mb-6 flex-grow">
        {service.description}
      </p>

      {/* Bullets */}
      <ul className="space-y-3 mb-8">
        {service.bullets.map((bullet, index) => (
          <li
            key={index}
            className="flex items-start text-sm text-gray-300"
          >
            <svg
              className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-emerald-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Timeline and Price */}
      <div className="flex items-center justify-between mb-6 text-sm border-t border-white/5 pt-4">
        <div className="flex items-center text-gray-400">
          <svg
            className="w-5 h-5 mr-2"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{service.timeline}</span>
        </div>
        <div className={`font-bold ${service.isFree ? 'text-green-400 text-lg' : 'text-white'}`}>
          {service.priceRange}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        <Button
          onClick={handleRequestQuote}
          className="w-full justify-center"
          variant={service.isFree ? 'primary' : 'gradient'} // Assuming 'gradient' variant exists or falls back to primary with gradient logic if implemented, or just use primary/outline
        // Actually Button component usually has variants like 'primary', 'secondary', 'outline', 'ghost'.
        // ServiceCard used custom gradient. Let's try to stick to Button usage or keep custom className.
        // Button component in step 268 (Home) used without variant (default primary).
        // Let's use className to override if needed or just use primary.
        >
          {service.isFree ? 'Get Started Free' : 'Request Quote'}
        </Button>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
