import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import BookingModal from '../components/BookingModal';
import { API } from '../lib/api';
import Button from '../components/ui/Button';

/**
 * Experts page - displays expert profiles with certifications, ratings, and reviews
 */
const Experts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [expandedReviews, setExpandedReviews] = useState({});
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await API.experts.getAll('approved');
      if (response.data.success) {
        // Transform backend data to match frontend format
        const transformedExperts = response.data.experts.map(expert => ({
          id: expert.id,
          name: expert.user?.name || 'Expert',
          bio: expert.bio,
          profile_picture: `https://ui-avatars.com/api/?name=${expert.user?.name || 'Expert'}&background=random`,
          expertise: [], // Can be added later
          rate_per_hour: expert.rate_per_hour,
          experience_years: 10, // Default value
          certifications: Array.isArray(expert.certificate_urls) ? expert.certificate_urls :
            (expert.certificate_urls ? JSON.parse(expert.certificate_urls) : []),
          rating: 4.8, // Default rating
          total_reviews: 0, // Default
          level: 'Expert', // Default level
          reviews: [] // Can be added later
        }));
        setExperts(transformedExperts);
      }
    } catch (error) {
      console.error('Failed to fetch experts:', error);
      showToast('Failed to load experts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleBookExpert = (expert) => {
    if (!user) {
      showToast('Please login to book a consultation', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    setSelectedExpert(expert);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    showToast('Booking confirmed successfully!', 'success');
    setShowBookingModal(false);
    setSelectedExpert(null);
    // Optionally navigate to bookings page
    setTimeout(() => navigate('/bookings'), 2000);
  };

  const toggleReviews = (expertId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [expertId]: !prev[expertId]
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05 }}></div>
      </div>

      <SEO
        title="Expert Consultations"
        description="Connect with industry-leading professionals for personalized career guidance. Book 1-on-1 video consultations with verified experts."
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
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400">
              Top Quality Mentors
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our <span className="text-gradient">Experts</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Connect with industry-leading professionals who can guide your career journey
          </p>
        </motion.header>

        {experts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-gray-300 text-xl font-medium mb-2">No experts available yet</p>
            <p className="text-gray-500">Check back later or become an expert yourself!</p>
          </div>
        ) : (
          /* Experts Grid */
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {experts.map((expert) => (
              <motion.article
                key={expert.id}
                variants={itemVariants}
                className="glass-card overflow-hidden group hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="p-6">
                  {/* Expert Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative">
                      <img
                        src={expert.profile_picture}
                        alt={expert.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/50 group-hover:ring-indigo-500 transition-all"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#0a0a0f] rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                        {expert.name}
                      </h2>
                      <p className="text-sm text-indigo-400 font-medium mb-1">
                        {expert.level}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-xs text-yellow-500 font-medium border border-yellow-500/20">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {expert.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          {expert.total_reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed h-10">
                    {expert.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2">
                      {expert.expertise.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-white/5 text-gray-300 border border-white/10 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {expert.expertise.length > 3 && (
                        <span className="px-2.5 py-1 bg-white/5 text-gray-400 border border-white/10 text-xs rounded-full">
                          +{expert.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rate and Book Button */}
                  <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                    <div>
                      <p className="text-lg font-bold text-white flex items-baseline gap-1">
                        ₹{expert.rate_per_hour}
                        <span className="text-xs font-normal text-gray-500">/hr</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{expert.experience_years}+ yrs exp</p>
                    </div>
                    <Button
                      onClick={() => handleBookExpert(expert)}
                      size="sm"
                      className="shadow-lg shadow-indigo-500/20"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.section
          className="mt-20 text-center rounded-3xl p-10 relative overflow-hidden border border-white/10"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md z-0" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Want to become an expert on our platform?
            </h2>
            <p className="text-lg mb-8 text-gray-300 opacity-90">
              Share your knowledge and help others grow in their careers
            </p>
            <Button
              onClick={() => navigate('/expert/register')}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 border-none shadow-xl"
            >
              Apply as Expert
            </Button>
          </div>
        </motion.section>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {showBookingModal && selectedExpert && (
        <BookingModal
          expert={selectedExpert}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedExpert(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Experts;

