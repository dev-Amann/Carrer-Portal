import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import servicesData from '../data/services';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Services page - displays all available services
 * Requirements: 14.1, 14.2, 14.3, 14.4
 */
const Services = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5
      }
    }
  };

  return (
    <div className="services-page min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Our Services"
        description="Comprehensive career development solutions including career recommendations, skill gap analysis, expert consultations, resume review, and interview preparation."
      />
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive career development solutions tailored to help you achieve your professional goals
          </p>
        </motion.header>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {servicesData.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional CTA Section */}
        <motion.section
          className="mt-20 text-center bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl p-12 text-white"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Not sure which service is right for you?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get in touch with us and we'll help you find the perfect solution for your career goals
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            Contact Us
          </a>
        </motion.section>
      </div>
    </div>
  );
};

export default Services;
