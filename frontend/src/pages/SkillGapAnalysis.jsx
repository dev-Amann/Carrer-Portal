import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-500 font-medium">Analyzing Skills...</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Failed to load analysis</p>
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <SEO title={`Skill Gap - ${career_title}`} description="Analyze your skill gaps and readiness for this career." />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/career-recommendation')}
            className="mb-6 text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors group text-sm font-medium"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Recommendations
          </button>

          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">
              Skill Gap Analysis
            </h1>
            <p className="text-xl text-indigo-600 font-medium">
              Target Career: {career_title}
            </p>
          </div>
        </div>

        {/* Components */}
        <div className="space-y-8">
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
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center py-6 border-t border-slate-200">
          <Button
            onClick={() => navigate('/career-recommendation')}
            variant="outline"
            className="w-full sm:w-auto px-8 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            View Other Careers
          </Button>
          <Button
            onClick={() => navigate('/experts')}
            className="w-full sm:w-auto px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Get Expert Guidance
          </Button>
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

export default SkillGapAnalysis;
