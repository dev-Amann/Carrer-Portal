import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Contact page - full contact form with alternate contact methods
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5
 */
const Contact = () => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Get prefilled service from navigation state
  const prefilledService = location.state?.interestedService || '';

  return (
    <div className="contact-page min-h-screen bg-[#0a0a0f] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>
      <SEO
        title="Contact Us"
        description="Get in touch with CarrerPortal. Send us a message, schedule a meeting, or reach out through email or phone."
      />
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.header
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400">
              Support
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have a question or ready to start your career journey? We'd love to hear from you.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form - Takes 2 columns */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Send Us a Message
              </h2>
              <ContactForm prefilledService={prefilledService} />
            </div>
          </motion.div>

          {/* Sidebar - Alternate Contact Info */}
          <motion.aside
            className="lg:col-span-1"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.4 }}
          >
            <div className="space-y-6">
              {/* Alternate Contact Information */}
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-100">
                        Email
                      </div>
                      <a
                        href="mailto:dev.amansingh1@gmail.com"
                        className="text-blue-400 hover:underline"
                      >
                        dev.amansingh1@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold text-gray-100">
                        Phone
                      </div>
                      <a
                        href="tel:+919200000056"
                        className="text-blue-400 hover:underline"
                      >
                        92******56
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com/carrerportal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/carrerportal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-6 h-6 text-blue-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com/carrerportal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default Contact;
