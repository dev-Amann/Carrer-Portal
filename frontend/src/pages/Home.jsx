import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import MiniContactForm from '../components/MiniContactForm';
import servicesData from '../data/services';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import Button from '../components/ui/Button';

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
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=random',
      rating: 5,
      text: 'CarrerPortal helped me identify the perfect career path based on my skills. The expert consultation was invaluable in preparing for my interviews!'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      role: 'Data Analyst',
      company: 'Analytics Inc',
      image: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=random',
      rating: 5,
      text: 'The skill gap analysis showed me exactly what I needed to learn. Within 6 months, I landed my dream job. Highly recommended!'
    },
    {
      id: 3,
      name: 'Anita Desai',
      role: 'Product Manager',
      company: 'StartupXYZ',
      image: 'https://ui-avatars.com/api/?name=Anita+Desai&background=random',
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
    <div className="min-h-screen bg-[#0a0a0f]">
      <SEO
        title="Home"
        description="Skill-based career recommendations, expert consultations, and career development resources. Get personalized career guidance powered by AI."
      />
      {/* Hero Section */}
      <Hero />

      {/* Services Summary Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
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
                <div className="h-full transform hover:-translate-y-2 transition-transform duration-300">
                  <ServiceCard service={service} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              onClick={() => navigate('/services')}
              className="px-10 py-4 text-lg shadow-lg shadow-indigo-500/20"
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f16] relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05 }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              What Our <span className="text-gradient">Users Say</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Real stories from professionals who transformed their careers with CarrerPortal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                className="glass-card p-8 hover:bg-white/5 transition-colors duration-300"
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
                <div className="flex items-center mb-6">
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
                <p className="text-gray-300 mb-8 italic leading-relaxed text-lg">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 ring-2 ring-indigo-500/50"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f] relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get started with your career journey in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <motion.div
              className="glass-card p-10 text-center relative group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInVariants}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-indigo-500/30">
                <span className="text-3xl font-bold text-indigo-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Share Your Skills
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Tell us about your technical and soft skills, interests, and experience level.
              </p>
            </motion.div>

            <motion.div
              className="glass-card p-10 text-center relative group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInVariants}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/30">
                <span className="text-3xl font-bold text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Get Recommendations
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Our algorithm analyzes your profile and suggests careers with match percentages.
              </p>
            </motion.div>

            <motion.div
              className="glass-card p-10 text-center relative group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInVariants}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
                <span className="text-3xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Bridge Skill Gaps
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Access curated learning resources to develop missing skills for your dream career.
              </p>
            </motion.div>
          </div>

          {/* Expert Consultation CTA */}
          <motion.div
            className="relative rounded-3xl p-8 md:p-12 overflow-hidden text-center border border-white/10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-blue-900/50 backdrop-blur-xl z-0" />

            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Need Personalized Guidance?
              </h3>
              <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto">
                Book 1-on-1 video sessions with industry professionals for personalized guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={() => navigate('/services')} size="lg" className="shadow-xl shadow-indigo-500/20">
                  Get Started Free
                </Button>
                <Button onClick={() => navigate('/experts')} variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                  Browse Experts
                </Button>
              </div>

              {/* Expert Registration CTA */}
              <div className="mt-12 pt-10 border-t border-white/10">
                <p className="text-gray-400 mb-6">
                  Are you an industry expert? Share your knowledge and earn!
                </p>
                <button
                  onClick={() => navigate('/expert/register')}
                  className="group flex items-center gap-2 mx-auto text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  <span>Become an Expert</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mini Contact Form Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f16] relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-lg text-gray-400">
              Have questions? Send us a message and we'll get back to you soon.
            </p>
          </motion.div>

          <motion.div
            className="glass-panel p-8 md:p-12 shadow-2xl"
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

