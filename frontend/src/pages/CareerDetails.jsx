import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

// Components
import CareerHeader from '../components/career-details/CareerHeader';
import CareerInfo from '../components/career-details/CareerInfo';
import RequiredSkillsList from '../components/career-details/RequiredSkillsList';

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
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-medium animate-pulse">Loading Career Details...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center glass-card p-12">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-400 mb-6 text-xl">Career not found</p>
          <Button
            onClick={() => navigate('/career-recommendation')}
            variant="outline"
          >
            Return to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      <SEO title={career.title} description={career.description} />

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.03 }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/career-recommendation')}
          className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Recommendations
        </button>

        <CareerHeader
          title={career.title}
          salaryRange={career.salary_range}
          demandLevel={career.demand_level}
        />

        <CareerInfo
          description={career.description}
          roadmap={career.roadmap}
        />

        <RequiredSkillsList skills={career.required_skills} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5"
        >
          <Button
            onClick={() => navigate(`/skill-gap/${career.id}`)}
            variant="gradient"
            className="flex-1 justify-center py-4 text-lg shadow-lg shadow-indigo-500/20"
          >
            🎯 Analyze Skill Gap
          </Button>
          <Button
            onClick={() => navigate('/experts')}
            variant="outline"
            className="flex-1 justify-center py-4 text-lg"
          >
            👨‍🏫 Find Expert Mentor
          </Button>
        </motion.div>
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

