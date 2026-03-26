import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check expert status
  if (profile && profile.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-slate-200">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification in Progress</h2>
          <p className="text-slate-600 mb-6">
            Your expert profile is currently under review by our admin team. This process usually takes 24-48 hours.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-500">
            <p>We'll notify you via email once your profile is approved and live.</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  if (profile && profile.status === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Rejected</h2>
          <p className="text-slate-600 mb-6">
            Unfortunately, your expert application could not be approved at this time.
          </p>
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-sm text-red-700">
            <p>Please contact support for more information or to submit a new application.</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'earnings', label: 'Earnings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <SEO title="Expert Dashboard" description="Manage your expert profile and bookings" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.name?.[0]}
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Expert Panel
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {profile && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
                  <span className={`w-2 h-2 rounded-full ${profile.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-xs font-medium text-slate-600 capitalize">{profile.status}</span>
                </div>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                size="sm"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your sessions today.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto pb-2">
          <nav className="flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <svg className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
                {tab.id === 'bookings' && bookings.some(b => b.status === 'confirmed') && (
                  <span className="ml-1.5 flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="animate-fade-in space-y-6">
          {activeTab === 'overview' && earnings && (
            <>
              <ExpertStats earnings={earnings} />
              <UpcomingSessions bookings={bookings} />
            </>
          )}

          {activeTab === 'bookings' && (
            <BookingsTable
              bookings={bookings}
              filter={bookingFilter}
              onFilterChange={setBookingFilter}
            />
          )}

          {activeTab === 'earnings' && (
            <EarningsSummary earnings={earnings} />
          )}

          {activeTab === 'profile' && profile && (
            <ExpertProfile
              profile={profile}
              onSave={handleSaveProfile}
            />
          )}
        </div>
      </main>

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
