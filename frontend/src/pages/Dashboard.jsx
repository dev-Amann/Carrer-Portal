import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import Toast from '../components/Toast';

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
      const bookingsResponse = await api.get('/bookings/user');
      const bookings = bookingsResponse.data.bookings || [];
      setRecentBookings(bookings.slice(0, 3));
      
      // Fetch saved careers
      const savedResponse = await api.get('/careers/saved');
      const saved = savedResponse.data.careers || [];
      setSavedCareers(saved);
      
      // Fetch user skills
      const skillsResponse = await api.get('/skills/user');
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
      await api.delete(`/careers/save/${careerId}`);
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
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-gray-400">
            Here's your career development overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">My Skills</p>
                <p className="text-3xl font-bold text-white">{stats.skillsCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/career-recommendation?action=update')}
              className="mt-4 text-sm text-blue-400 hover:underline"
            >
              Update Skills →
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Bookings</p>
                <p className="text-3xl font-bold text-white">{stats.bookingsCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/bookings')}
              className="mt-4 text-sm text-green-400 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Career Matches</p>
                <p className="text-3xl font-bold text-white">{stats.recommendationsCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/career-recommendation?action=update')}
              className="mt-4 text-sm text-purple-400 hover:underline"
            >
              Get Recommendations →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/career-recommendation?action=update')}
              className="p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-400 hover:bg-blue-900/20 transition-colors text-left"
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-white mb-1">Career Recommendations</h3>
              <p className="text-sm text-gray-400">Get AI-powered career suggestions</p>
            </button>

            <button
              onClick={() => navigate('/experts')}
              className="p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-green-400 hover:bg-green-900/20 transition-colors text-left"
            >
              <div className="text-2xl mb-2">👨‍🏫</div>
              <h3 className="font-semibold text-white mb-1">Browse Experts</h3>
              <p className="text-sm text-gray-400">Find industry professionals</p>
            </button>

            <button
              onClick={() => navigate('/expert/register')}
              className="p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-orange-400 hover:bg-orange-900/20 transition-colors text-left"
            >
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="font-semibold text-white mb-1">Become an Expert</h3>
              <p className="text-sm text-gray-400">Share your expertise with others</p>
            </button>

            <button
              onClick={() => navigate('/bookings')}
              className="p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-purple-400 hover:bg-purple-900/20 transition-colors text-left"
            >
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold text-white mb-1">My Bookings</h3>
              <p className="text-sm text-gray-400">View your consultations</p>
            </button>

            <button
              onClick={() => navigate('/services')}
              className="p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-orange-400 hover:bg-orange-900/20 transition-colors text-left"
            >
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-white mb-1">Learning Resources</h3>
              <p className="text-sm text-gray-400">Explore courses and guides</p>
            </button>
          </div>
        </div>

        {/* Saved Careers */}
        {savedCareers.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                🔥 Bookmarked Careers
              </h2>
              <button
                onClick={() => navigate('/career-recommendation')}
                className="text-sm text-blue-400 hover:underline"
              >
                View All Recommendations
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCareers.slice(0, 4).map((career) => (
                <div
                  key={career.id}
                  className="p-4 border border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">
                      {career.title}
                    </h3>
                    <button
                      onClick={() => handleUnsaveCareer(career.id)}
                      className="text-orange-500 hover:text-orange-600 text-xl"
                      title="Remove bookmark"
                    >
                      🔥
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {career.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Salary:</span>
                    <span className="font-semibold text-white">
                      {career.salary_range || 'N/A'}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/skill-gap/${career.id}`)}
                    className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    View Skill Gap
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Skills */}
        {userSkills.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Skills</h2>
              <button
                onClick={() => navigate('/career-recommendation?action=update')}
                className="text-sm text-blue-400 hover:underline"
              >
                Update Skills
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {userSkills.slice(0, 15).map((skill) => (
                <div
                  key={skill.skill_id}
                  className="px-3 py-2 bg-blue-900/30 text-blue-200 rounded-lg text-sm"
                >
                  <span className="font-medium">{skill.name}</span>
                  <span className="ml-2 text-xs opacity-75">({skill.proficiency})</span>
                </div>
              ))}
              {userSkills.length > 15 && (
                <div className="px-3 py-2 bg-gray-700 text-gray-400 rounded-lg text-sm">
                  +{userSkills.length - 15} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
            <button
              onClick={() => navigate('/bookings')}
              className="text-sm text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No bookings yet</h3>
              <p className="text-gray-400 mb-4">Book a consultation with an expert to get started</p>
              <button
                onClick={() => navigate('/experts')}
                className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg"
              >
                Browse Experts
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {booking.expert?.name || 'Expert Consultation'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formatDateTime(booking.slot_start)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <button
                      onClick={() => navigate('/bookings')}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
