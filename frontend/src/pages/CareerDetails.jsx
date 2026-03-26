import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Career Details...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-12 max-w-md">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Career Not Found</h2>
          <p className="text-slate-500 mb-6">We couldn't find the career path you're looking for.</p>
          <Button
            onClick={() => navigate('/career-recommendation')}
            variant="outline"
            className="w-full justify-center"
          >
            Return to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title={career.title} description={career.description} />

      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/career-recommendation')}
          className="mb-8 text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors group text-sm font-medium"
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
          learningResources={career.learning_resources || []}
        />

        <RequiredSkillsList skills={career.required_skills} />

        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100 mt-8">
          <Button
            onClick={() => navigate(`/skill-gap/${career.id}`)}
            className="flex-1 justify-center py-4 text-base bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analyze Skill Gap
          </Button>
          <Button
            onClick={() => navigate('/experts')}
            variant="outline"
            className="flex-1 justify-center py-4 text-base border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Find Expert Mentor
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

export default CareerDetails;
