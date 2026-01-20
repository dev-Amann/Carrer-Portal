import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import servicesData from '../data/services';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import Button from '../components/ui/Button';

/**
 * Services page - displays all available services
 * Requirements: 14.1, 14.2, 14.3, 14.4
 */
const Services = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#0a0a0f] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05 }}></div>
      </div>

      <SEO
        title="Our Services"
        description="Comprehensive career development solutions including career recommendations, skill gap analysis, expert consultations, resume review, and interview preparation."
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-400">
              What We Offer
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
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
              <div className="h-full transform hover:-translate-y-2 transition-transform duration-300">
                <ServiceCard service={service} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional CTA Section */}
        <motion.section
          className="mt-24 text-center rounded-3xl p-12 relative overflow-hidden border border-white/10"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-blue-900/40 backdrop-blur-md z-0" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Not sure which service is right for you?
            </h2>
            <p className="text-lg mb-8 text-gray-300 opacity-90 max-w-2xl mx-auto">
              Get in touch with us and we'll help you find the perfect solution for your career goals
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/contact')} size="lg" className="shadow-lg shadow-indigo-500/20">
                Contact Sales
              </Button>
              <Button onClick={() => navigate('/signup')} variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                Sign Up Now
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Services;

