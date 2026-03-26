import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';
import StatsGrid from '../components/dashboard/StatsGrid';
import QuickActions from '../components/dashboard/QuickActions';
import SavedCareersList from '../components/dashboard/SavedCareersList';
import RecentBookings from '../components/dashboard/RecentBookings';
import SkillsSummary from '../components/dashboard/SkillsSummary';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    skillsCount: 0,
    bookingsCount: 0,
    recommendationsCount: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [savedCareers, setSavedCareers] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const bookingsResponse = await API.bookings.getUserBookings();
      const bookings = bookingsResponse.data.bookings || [];
      setRecentBookings(bookings.slice(0, 3));

      const savedResponse = await API.careers.getSaved();
      const saved = savedResponse.data.careers || [];
      setSavedCareers(saved);

      const skillsResponse = await API.skills.getUserSkills();
      const skills = skillsResponse.data.skills || [];
      setUserSkills(skills);

      setStats({
        skillsCount: skills.length,
        bookingsCount: bookings.length,
        recommendationsCount: saved.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveCareer = async (careerId) => {
    try {
      await API.careers.unsave(careerId);
      setSavedCareers(savedCareers.filter(c => c.id !== careerId));
      setStats(prev => ({ ...prev, recommendationsCount: prev.recommendationsCount - 1 }));
      showToast('Career removed from bookmarks', 'success');
    } catch (error) {
      showToast('Failed to remove career', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Dashboard" description="Your CareerPortal Overview" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/experts')} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
              Find Expert
            </Button>
            <Button onClick={() => navigate('/career-recommendation')} variant="outline" className="bg-white hover:bg-slate-50">
              Explore Careers
            </Button>
          </div>
        </div>

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <SavedCareersList savedCareers={savedCareers} onUnsaveCareer={handleUnsaveCareer} />
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-8">
            <RecentBookings recentBookings={recentBookings} />
            <SkillsSummary userSkills={userSkills} />
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default Dashboard;
