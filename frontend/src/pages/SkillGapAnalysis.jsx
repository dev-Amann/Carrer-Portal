import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

// Components
import ReadinessOverview from '../components/skill-gap/ReadinessOverview';
import MetSkillsList from '../components/skill-gap/MetSkillsList';
import GapSkillsList from '../components/skill-gap/GapSkillsList';

const SkillGapAnalysis = () => {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchSkillGap();
  }, [careerId]);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      const response = await API.careers.getSkillGap(careerId);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Skill Gap Analysis Error:', error);
      showToast(error.response?.data?.error || 'Failed to load skill gap analysis', 'error');
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="mt-4 text-indigo-400 font-medium">Analyzing Skills...</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Failed to load analysis</p>
          <Button
            onClick={() => navigate('/career-recommendation')}
          >
            Back to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  const { career_title, gaps, met_requirements, readiness_percentage, total_required_skills, met_skills_count } = analysis;

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      <SEO title={`Skill Gap - ${career_title}`} description="Analyze your skill gaps and readiness for this career." />

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.03 }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/career-recommendation')}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Recommendations
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Skill Gap Analysis
            </h1>
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-medium">
              Target Career: {career_title}
            </p>
          </motion.div>
        </div>

        {/* Components */}
        <ReadinessOverview
          readinessPercentage={readiness_percentage}
          metSkillsCount={met_skills_count}
          totalRequiredSkills={total_required_skills}
        />

        <div className="grid grid-cols-1 gap-8">
          <MetSkillsList skills={met_requirements} />

          <GapSkillsList
            gaps={gaps}
            onGetGuidance={() => navigate('/experts')}
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center py-6 border-t border-white/5"
        >
          <Button
            onClick={() => navigate('/career-recommendation')}
            variant="outline"
            className="w-full sm:w-auto px-8"
          >
            View Other Careers
          </Button>
          <Button
            onClick={() => navigate('/experts')}
            variant="gradient"
            className="w-full sm:w-auto px-8 shadow-lg shadow-indigo-500/20"
          >
            👨‍🏫 Get Expert Guidance
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

export default SkillGapAnalysis;

