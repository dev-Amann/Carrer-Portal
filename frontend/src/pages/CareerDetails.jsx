import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

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
      const response = await API.careers.getById(careerId);
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Career not found</p>
          <Button
            onClick={() => navigate('/career-recommendation')}
          >
            Back to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title={career.title} description={career.description} />
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/career-recommendation')}
          className="mb-6 text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-2 transition-colors"
        >
          ← Back to Recommendations
        </button>

        <div className="glass-card p-8 animate-fade-in-up">
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
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${career.demand_level === 'very_high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
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
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
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
            <Button
              onClick={() => navigate(`/skill-gap/${career.id}`)}
              variant="gradient"
              className="flex-1 justify-center"
            >
              View Skill Gap Analysis
            </Button>
            <Button
              onClick={() => navigate('/experts')}
              variant="outline"
            >
              Find Expert
            </Button>
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
