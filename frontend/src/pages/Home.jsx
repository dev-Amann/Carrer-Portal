import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import Button from '../components/ui/Button';

/**
 * Home page component - main landing page with all key sections
 * Requirements: 22.1, 22.2, 22.3, 22.4, 25.1, 25.2, 25.3, 25.4, 25.5
 */
const Home = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

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
                <Button onClick={() => navigate('/career-recommendation')} size="lg" className="shadow-xl shadow-indigo-500/20">
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

    </div>
  );
};

export default Home;

