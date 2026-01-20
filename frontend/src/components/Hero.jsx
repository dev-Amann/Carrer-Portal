import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import Button from './ui/Button';

const Hero = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

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
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-2000" />
        </div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.1 }}></div>
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 backdrop-blur-md shadow-xl">
            ✨ Revolutionizing Career Growth with AI
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-tight"
          variants={itemVariants}
        >
          Your Future, <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
            Designed by AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Discover your ideal career path with AI-powered recommendations.
          Connect with industry experts, bridge skill gaps, and accelerate your professional growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          variants={itemVariants}
        >
          <Button
            onClick={() => navigate('/services')}
            size="lg"
            className="w-full sm:w-auto shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all text-lg px-8 py-6 h-auto"
          >
            Get Started
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>

          <Button
            onClick={() => navigate('/contact')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-6 h-auto border-white/10 hover:bg-white/5"
          >
            Contact Sales
          </Button>
        </motion.div>

        {/* Stats / Social Proof */}
        <motion.div
          variants={itemVariants}
          className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-80"
        >
          {[
            { label: 'Active Users', value: '10K+' },
            { label: 'Career Paths', value: '500+' },
            { label: 'Experts', value: '100+' },
            { label: 'Success Rate', value: '94%' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

