import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

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
      console.log('Skill Gap Analysis Response:', response.data);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
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
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title={`Skill Gap - ${career_title}`} description="Analyze your skill gaps and readiness for this career." />

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/career-recommendation')}
            className="mb-4 text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-2 transition-colors"
          >
            ← Back to Recommendations
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            Skill Gap Analysis
          </h1>
          <p className="text-xl text-gray-400">
            {career_title}
          </p>
        </div>

        {/* Readiness Score */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/20 rounded-2xl p-8 mb-8 text-white backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Career Readiness</h2>
              <p className="text-lg opacity-90">
                You meet {met_skills_count} out of {total_required_skills} required skills
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold">{readiness_percentage}%</div>
              <div className="text-sm opacity-90">Ready</div>
            </div>
          </div>
        </div>

        {/* Met Requirements */}
        {met_requirements.length > 0 && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Skills You Have ({met_requirements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {met_requirements.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl"
                >
                  <div>
                    <h3 className="font-semibold text-white">{skill.skill_name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{skill.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Your Level</div>
                    <div className="font-semibold text-green-400 capitalize">
                      {skill.current_level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Gaps */}
        {gaps.length > 0 && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Skills to Develop ({gaps.length})
            </h2>
            <div className="space-y-4">
              {gaps.map((skill, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${skill.status === 'missing'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{skill.skill_name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{skill.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${skill.status === 'missing'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                      {skill.status === 'missing' ? 'Not Started' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-400">Current: </span>
                      <span className="font-semibold text-white capitalize">
                        {skill.current_level || 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Required: </span>
                      <span className="font-semibold text-white capitalize">
                        {skill.required_level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            onClick={() => navigate('/career-recommendation')}
            variant="outline"
          >
            View Other Careers
          </Button>
          <Button
            onClick={() => navigate('/experts')}
            variant="gradient"
          >
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
