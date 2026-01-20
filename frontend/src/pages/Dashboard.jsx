import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

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

      // Fetch bookings
      const bookingsResponse = await API.bookings.getUserBookings();
      const bookings = bookingsResponse.data.bookings || [];
      setRecentBookings(bookings.slice(0, 3));

      // Fetch saved careers
      const savedResponse = await API.careers.getSaved();
      const saved = savedResponse.data.careers || [];
      setSavedCareers(saved);

      // Fetch user skills
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative">
      <SEO title="Dashboard" description="Overview of your career progress, bookings, and skills." />
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-gradient">{user?.name}</span>!
          </h1>
          <p className="text-lg text-gray-400">
            Here's your career development overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">My Skills</p>
                  <p className="text-4xl font-bold text-white">{stats.skillsCount}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => navigate('/career-recommendation?action=update')}
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                Update Skills
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Bookings</p>
                  <p className="text-4xl font-bold text-white">{stats.bookingsCount}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => navigate('/bookings')}
                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Career Matches</p>
                  <p className="text-4xl font-bold text-white">{stats.recommendationsCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => navigate('/career-recommendation?action=update')}
                className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
              >
                Get Recommendations
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Career Recommendations", desc: "Get AI-powered career suggestions", icon: "🎯", color: "blue", path: "/career-recommendation?action=update" },
              { title: "Browse Experts", desc: "Find industry professionals", icon: "👨‍🏫", color: "green", path: "/experts" },
              { title: "Become an Expert", desc: "Share your expertise with others", icon: "⭐", color: "orange", path: "/expert/register" },
              { title: "My Bookings", desc: "View your consultations", icon: "📅", color: "purple", path: "/bookings" },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="glass-card p-5 text-left hover:scale-[1.02] transition-transform group"
              >
                <div className="text-3xl mb-3 bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-white/10 transition-colors">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Skills */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                My Skills
              </h2>
              <Button
                onClick={() => navigate('/career-recommendation?action=update')}
                size="sm"
                variant="outline"
              >
                Update
              </Button>
            </div>

            {userSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 15).map((skill) => (
                  <div
                    key={skill.skill_id}
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-sm font-medium"
                  >
                    <span>{skill.name}</span>
                    <span className="ml-2 text-xs opacity-60">| {skill.proficiency}</span>
                  </div>
                ))}
                {userSkills.length > 15 && (
                  <div className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-sm">
                    +{userSkills.length - 15} more
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-gray-400 mb-4">No skills added yet</p>
                <Button
                  onClick={() => navigate('/career-recommendation?action=update')}
                  size="sm"
                >
                  Add Skills
                </Button>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                Recent Bookings
              </h2>
              <Button
                onClick={() => navigate('/bookings')}
                size="sm"
                variant="outline"
              >
                View All
              </Button>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">No bookings yet</p>
                <Button
                  onClick={() => navigate('/experts')}
                  size="sm"
                >
                  Browse Experts
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {booking.expert?.name || 'Expert Consultation'}
                      </h3>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDateTime(booking.slot_start)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Saved Careers */}
        {savedCareers.length > 0 && (
          <div className="glass-card p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Bookmarked Careers
              </h2>
              <Button
                onClick={() => navigate('/career-recommendation')}
                size="sm"
                variant="outline"
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCareers.slice(0, 3).map((career) => (
                <div
                  key={career.id}
                  className="p-5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors relative group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white text-lg">
                      {career.title}
                    </h3>
                    <button
                      onClick={() => handleUnsaveCareer(career.id)}
                      className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Remove bookmark"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">
                    {career.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <span className="text-gray-500">Avg Salary:</span>
                    <span className="font-semibold text-green-400">
                      {career.salary_range || 'N/A'}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate(`/skill-gap/${career.id}`)}
                    className="w-full"
                    size="sm"
                  >
                    View Skill Gap
                  </Button>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default Dashboard;

