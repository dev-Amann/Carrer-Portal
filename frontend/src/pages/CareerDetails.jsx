import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Toast from '../components/Toast';

const CareerDetails = () => {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchCareerDetails();
  }, [careerId]);

  const fetchCareerDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/careers/${careerId}`);
      setCareer(response.data.career);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load career details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Career not found</p>
          <button
            onClick={() => navigate('/career-recommendation')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/career-recommendation')}
          className="mb-6 text-blue-400 hover:underline flex items-center gap-2"
        >
          ← Back to Recommendations
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {career.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Salary:</span>
              <span className="font-semibold text-white">
                {career.salary_range || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Demand:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                career.demand_level === 'very_high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                career.demand_level === 'high' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                career.demand_level === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {career.demand_level?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {career.description}
            </p>
          </div>

          {career.roadmap && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">Learning Roadmap</h2>
              <p className="text-gray-300 leading-relaxed">
                {career.roadmap}
              </p>
            </div>
          )}

          {career.required_skills && career.required_skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Required Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {career.required_skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-white">{skill.skill_name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{skill.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-semibold capitalize">
                      {skill.required_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/skill-gap/${career.id}`)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg"
            >
              View Skill Gap Analysis
            </button>
            <button
              onClick={() => navigate('/experts')}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
            >
              Find Expert
            </button>
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

export default CareerDetails;
