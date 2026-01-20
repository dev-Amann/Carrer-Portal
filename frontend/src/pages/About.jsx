import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * About page - company story, mission, workflow, team, and achievements
 * Requirements: 26.1, 26.2, 26.3, 26.4, 26.5
 */
const About = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const workflowPhases = [
    {
      phase: 'Discovery',
      description: 'We dive deep into understanding your goals, challenges, and vision',
      icon: '🔍'
    },
    {
      phase: 'Design',
      description: 'Crafting intuitive solutions that align with your objectives',
      icon: '🎨'
    },
    {
      phase: 'Build',
      description: 'Developing robust, scalable solutions with cutting-edge technology',
      icon: '🔨'
    },
    {
      phase: 'Deliver',
      description: 'Launching your solution with comprehensive testing and support',
      icon: '🚀'
    },
    {
      phase: 'Support',
      description: 'Ongoing maintenance, updates, and continuous improvement',
      icon: '🛠️'
    }
  ];

  const teamMembers = [
    {
      name: 'Aman',
      role: 'Full Stack & AI',
      description: 'Expert in building scalable web applications and AI-powered solutions',
      image: 'https://picsum.photos/seed/aman/400/400'
    },
    {
      name: 'Partner',
      role: 'Mobile Apps & UI',
      description: 'Specialist in creating beautiful, user-friendly mobile experiences',
      image: 'https://picsum.photos/seed/partner/400/400'
    }
  ];

  const achievements = [
    {
      label: '50+ Projects',
      description: 'Successfully delivered',
      icon: '📊'
    },
    {
      label: '98% Satisfaction',
      description: 'Client satisfaction rate',
      icon: '⭐'
    },
    {
      label: '5+ Years',
      description: 'Industry experience',
      icon: '🏆'
    },
    {
      label: '24/7 Support',
      description: 'Always here to help',
      icon: '💬'
    }
  ];

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
    <div className="about-page min-h-screen bg-[#0a0a0f] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>
      <SEO
        title="About Us"
        description="Learn about CarrerPortal's mission to democratize access to quality career guidance through technology and expert mentorship."
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            About CarrerPortal
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Empowering careers through technology and personalized guidance
          </p>
        </motion.header>

        {/* Company Story and Mission */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              CarrerPortal was born from a simple observation: talented individuals often struggle to find
              the right career path that matches their unique skills and aspirations. We saw countless
              professionals feeling lost in their career journey, unsure of which direction to take or
              how to bridge the gap between where they are and where they want to be.
            </p>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Founded by a team of technologists and career development experts, we set out to create
              a platform that combines cutting-edge AI technology with human expertise to provide
              personalized career guidance at scale.
            </p>
            <h3 className="text-2xl font-bold text-gray-100 mb-4 mt-8">
              Our Mission
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              To democratize access to quality career guidance by leveraging technology and connecting
              individuals with the right resources, mentors, and opportunities to achieve their
              professional goals.
            </p>
            <h3 className="text-2xl font-bold text-gray-100 mb-4 mt-8">
              Our Values
            </h3>
            <ul className="space-y-3 text-lg text-gray-300">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-3">✓</span>
                <span><strong>Personalization:</strong> Every career journey is unique</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-3">✓</span>
                <span><strong>Accessibility:</strong> Quality guidance should be available to everyone</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-3">✓</span>
                <span><strong>Innovation:</strong> Continuously improving through technology</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-3">✓</span>
                <span><strong>Integrity:</strong> Honest, transparent, and ethical in all we do</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Workflow Timeline */}
        <motion.section
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-12 text-center">
            Our Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowPhases.map((phase, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="glass-card rounded-xl p-6 shadow-lg text-center h-full hover:border-indigo-500/50 transition-colors">
                  <div className="text-5xl mb-4">{phase.icon}</div>
                  <h3 className="text-xl font-bold text-gray-100 mb-3">
                    {phase.phase}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {phase.description}
                  </p>
                </div>
                {index < workflowPhases.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Members */}
        <motion.section
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-2xl font-bold text-gray-100 mb-2">
                  {member.name}
                </h3>
                <p className="text-lg text-blue-400 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-400">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievement Badges */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-12 text-center">
            Our Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6 text-white text-center shadow-lg backdrop-blur-sm"
              >
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <div className="text-3xl font-bold mb-2">{achievement.label}</div>
                <div className="text-sm opacity-90">{achievement.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
