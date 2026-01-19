import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import BookingModal from '../components/BookingModal';
import { API } from '../lib/api';

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
          profile_picture: `https://picsum.photos/seed/expert${expert.id}/400/400`,
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
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="experts-page min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Expert Consultations"
        description="Connect with industry-leading professionals for personalized career guidance. Book 1-on-1 video consultations with verified experts."
      />
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Meet Our Experts
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Connect with industry-leading professionals who can guide your career journey
          </p>
        </motion.header>

        {experts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No experts available at the moment.</p>
          </div>
        ) : (
          /* Experts Grid */
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          {experts.map((expert) => (
            <motion.article
              key={expert.id}
              variants={itemVariants}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5">
                {/* Expert Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={expert.profile_picture}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white truncate">
                      {expert.name}
                    </h2>
                    <p className="text-sm text-blue-400 font-medium">
                      {expert.level}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex">
                        {renderStars(expert.rating)}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">
                        {expert.rating} ({expert.total_reviews})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                  {expert.bio}
                </p>

                {/* Expertise Tags */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {expert.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {expert.expertise.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">
                        +{expert.expertise.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Certifications - Collapsible */}
                <div className="mb-3">
                  <button
                    onClick={() => toggleReviews(expert.id)}
                    className="text-xs font-semibold text-gray-300 hover:text-blue-400 flex items-center gap-1"
                  >
                    <span>{expert.certifications.length} Certifications</span>
                    <svg
                      className={`w-3 h-3 transition-transform ${expandedReviews[expert.id] ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedReviews[expert.id] && (
                    <ul className="mt-2 space-y-1">
                      {expert.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start text-xs text-gray-400">
                          <svg className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="line-clamp-1">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recent Review */}
                {expert.reviews && expert.reviews.length > 0 && (
                  <div className="mb-3 bg-gray-700/50 rounded p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex">
                        {renderStars(expert.reviews[0].rating)}
                      </div>
                      <span className="text-xs font-medium text-white">
                        {expert.reviews[0].user}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 italic line-clamp-2">
                      "{expert.reviews[0].comment}"
                    </p>
                  </div>
                )}

                {/* Rate and Book Button */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div>
                    <p className="text-xl font-bold text-white">
                      ₹{expert.rate_per_hour}
                      <span className="text-xs font-normal text-gray-400">/hr</span>
                    </p>
                    <p className="text-xs text-gray-400">{expert.experience_years}+ yrs exp</p>
                  </div>
                  <button
                    onClick={() => handleBookExpert(expert)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.section
          className="mt-12 text-center bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl p-8 text-white"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-3">
            Want to become an expert on our platform?
          </h2>
          <p className="text-base mb-6 opacity-90">
            Share your knowledge and help others grow in their careers
          </p>
          <button
            onClick={() => navigate('/expert/register')}
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            Apply as Expert
          </button>
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
