import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import MiniContactForm from '../components/MiniContactForm';
import servicesData from '../data/services';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Home page component - main landing page with all key sections
 * Requirements: 22.1, 22.2, 22.3, 22.4, 25.1, 25.2, 25.3, 25.4, 25.5
 */
const Home = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Select first 3-5 services for summary
  const featuredServices = servicesData.slice(0, 3);

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'Tech Corp',
      image: 'https://picsum.photos/seed/testimonial1/100/100',
      rating: 5,
      text: 'CarrerPortal helped me identify the perfect career path based on my skills. The expert consultation was invaluable in preparing for my interviews!'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      role: 'Data Analyst',
      company: 'Analytics Inc',
      image: 'https://picsum.photos/seed/testimonial2/100/100',
      rating: 5,
      text: 'The skill gap analysis showed me exactly what I needed to learn. Within 6 months, I landed my dream job. Highly recommended!'
    },
    {
      id: 3,
      name: 'Anita Desai',
      role: 'Product Manager',
      company: 'StartupXYZ',
      image: 'https://picsum.photos/seed/testimonial3/100/100',
      rating: 5,
      text: 'The AI-powered recommendations were spot-on. The platform made my career transition smooth and stress-free.'
    }
  ];

  const fadeInVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6 }
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Home"
        description="Skill-based career recommendations, expert consultations, and career development resources. Get personalized career guidance powered by AI."
      />
      {/* Hero Section */}
      <Hero />

      {/* Services Summary Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Comprehensive career development solutions tailored to your unique journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: prefersReducedMotion ? 0 : index * 0.1
                    }
                  }
                }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/services')}
              className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Real stories from professionals who transformed their careers with CarrerPortal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                className="bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: prefersReducedMotion ? 0 : 0.5,
                      delay: prefersReducedMotion ? 0 : index * 0.1
                    }
                  }
                }}
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-300">
              Get started with your career journey in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              className="bg-gray-800 rounded-xl p-8 shadow-lg text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInVariants}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Share Your Skills
              </h3>
              <p className="text-gray-400">
                Tell us about your technical and soft skills, interests, and experience level.
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-green-900/30 text-green-300 rounded-full text-sm font-semibold">
                FREE
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 rounded-xl p-8 shadow-lg text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInVariants}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Get Recommendations
              </h3>
              <p className="text-gray-400">
                Our algorithm analyzes your profile and suggests careers with match percentages.
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-green-900/30 text-green-300 rounded-full text-sm font-semibold">
                FREE
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 rounded-xl p-8 shadow-lg text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInVariants}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Bridge Skill Gaps
              </h3>
              <p className="text-gray-400">
                Access curated learning resources to develop missing skills for your dream career.
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-green-900/30 text-green-300 rounded-full text-sm font-semibold">
                FREE
              </div>
            </motion.div>
          </div>

          {/* Expert Consultation CTA */}
          <motion.div
            className="bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl p-8 md:p-12 shadow-2xl text-white text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Need Personalized Guidance?
            </h3>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Book 1-on-1 video sessions with industry professionals for personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/experts')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
              >
                Browse Experts
              </button>
            </div>
            
            {/* Expert Registration CTA */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-white/90 mb-4 text-sm">
                Are you an industry expert? Share your knowledge and earn!
              </p>
              <button
                onClick={() => navigate('/expert/register')}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-base rounded-lg hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-blue-500 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Become an Expert
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mini Contact Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-300">
              Have questions? Send us a message and we'll get back to you soon.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-900 rounded-lg p-8 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <MiniContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
