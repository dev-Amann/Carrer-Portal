import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

// Components
import ExpertStats from '../components/expert/ExpertStats';
import UpcomingSessions from '../components/expert/UpcomingSessions';
import BookingsTable from '../components/expert/BookingsTable';
import EarningsSummary from '../components/expert/EarningsSummary';
import ExpertProfile from '../components/expert/ExpertProfile';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const profileResponse = await API.expertDashboard.getProfile();
      setProfile(profileResponse.data.expert);

      const bookingsResponse = await API.expertDashboard.getBookings({});
      setBookings(bookingsResponse.data.bookings);

      const earningsResponse = await API.expertDashboard.getEarnings();
      setEarnings(earningsResponse.data.earnings);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching expert data:', error);
      if (error.response?.status === 403) {
        setToast({
          type: 'error',
          message: 'Expert profile not found. Please register as an expert.',
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setToast({
          type: 'error',
          message: 'Failed to load dashboard data',
        });
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/expert/login');
  };

  const handleSaveProfile = async (editForm) => {
    try {
      const response = await API.expertDashboard.updateProfile(editForm);
      if (response.data.success) {
        setProfile(response.data.expert);
        setToast({
          type: 'success',
          message: 'Profile updated successfully!',
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update profile',
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-24 relative overflow-hidden transition-colors duration-500">
      <SEO title="Expert Dashboard" description="Manage your expert profile and bookings" />

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.03 }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                {user?.name?.[0] || 'E'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Expert Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Status: {profile?.status || 'Active'}
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 pt-20">

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl w-full sm:w-auto inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && earnings && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <ExpertStats earnings={earnings} />
              <UpcomingSessions bookings={bookings} />
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <BookingsTable
                bookings={bookings}
                filter={bookingFilter}
                onFilterChange={setBookingFilter}
              />
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <EarningsSummary earnings={earnings} />
            </motion.div>
          )}

          {activeTab === 'profile' && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ExpertProfile
                profile={profile}
                onSave={handleSaveProfile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ExpertDashboard;

