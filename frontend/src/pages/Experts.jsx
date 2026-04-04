import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO
        title="Expert Consultations"
        description="Connect with industry-leading professionals for personalized career guidance. Book 1-on-1 video consultations with verified experts."
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <header className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Top Quality Mentors
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Meet Our <span className="text-indigo-600">Experts</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Connect with industry-leading professionals who can guide your career journey
          </p>
        </header>

        {experts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-slate-900 text-lg font-medium mb-1">No experts available yet</p>
            <p className="text-slate-500">Check back later or become an expert yourself!</p>
          </div>
        ) : (
          /* Experts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert) => (
              <article
                key={expert.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Expert Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative">
                      <img
                        src={expert.profile_picture}
                        alt={expert.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-50"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-slate-900 truncate">
                        {expert.name}
                      </h2>
                      <p className="text-sm text-indigo-600 font-medium mb-1">
                        {expert.level}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-xs text-yellow-700 font-medium border border-yellow-100">
                          <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {expert.rating}
                        </span>
                        <span className="text-xs text-slate-500">
                          {expert.total_reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-slate-600 mb-5 line-clamp-2 leading-relaxed h-10">
                    {expert.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2">
                      {expert.expertise.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {expert.expertise.length > 3 && (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs rounded-full border border-slate-100">
                          +{expert.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rate and Book Button */}
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                    <div>
                      <p className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
                        ₹{expert.rate_per_hour}
                        <span className="text-xs font-normal text-slate-500">/hr</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{expert.experience_years}+ yrs exp</p>
                    </div>
                    <Button
                      onClick={() => handleBookExpert(expert)}
                      size="sm"
                      className="bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}


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

