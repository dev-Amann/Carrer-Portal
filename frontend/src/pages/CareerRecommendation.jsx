import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import CareerComparisonModal from '../components/CareerComparisonModal';
import SkillSelection from '../components/career/SkillSelection';
import CareerResults from '../components/career/CareerResults';

const CareerRecommendation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [step, setStep] = useState(1); // 1: Skills selection, 2: Results
  const [allSkills, setAllSkills] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [savedCareerIds, setSavedCareerIds] = useState(new Set());
  const [showBookmarkTip, setShowBookmarkTip] = useState(false);

  useEffect(() => {
    fetchSkills();
    fetchSavedCareers();
    loadUserSkills();

    // Check if we should show the form (from dashboard navigation)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'update') {
      setStep(1);
      localStorage.removeItem('career_recommendations');
    } else {
      loadPreviousRecommendations();
    }
  }, []);

  // --- API Calls & Data Loading ---
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await API.skills.getAll();
      setAllSkills(response.data.skills || {});
    } catch (error) {
      showToast('Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUserSkills = async () => {
    try {
      const response = await API.skills.getUserSkills();
      if (response.data.success && response.data.skills.length > 0) {
        const userSkills = response.data.skills.map(s => ({
          skill_id: s.skill_id,
          name: s.name,
          category: s.category,
          proficiency: s.proficiency
        }));
        setSelectedSkills(userSkills);
      }
    } catch (error) {
      console.log('No previous skills found');
    }
  };

  const loadPreviousRecommendations = () => {
    try {
      const saved = localStorage.getItem('career_recommendations');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
          if (data.step === 2) {
            setStep(2);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load previous recommendations', error);
    }
  };

  const fetchSavedCareers = async () => {
    try {
      const response = await API.careers.getSaved();
      if (response.data.success) {
        const ids = new Set(response.data.careers.map(c => c.id));
        setSavedCareerIds(ids);
      }
    } catch (error) {
      console.error('Failed to load saved careers', error);
    }
  };

  // --- Handlers ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSkillToggle = (skillId, skillName, category) => {
    const existing = selectedSkills.find(s => s.skill_id === skillId);
    if (existing) {
      setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, {
        skill_id: skillId,
        name: skillName,
        category,
        proficiency: 'intermediate'
      }]);
    }
  };

  const handleProficiencyChange = (skillId, proficiency) => {
    setSelectedSkills(selectedSkills.map(s =>
      s.skill_id === skillId ? { ...s, proficiency } : s
    ));
  };

  const handleClearSkills = () => {
    setSelectedSkills([]);
    showToast('All skills cleared', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      showToast('Please select at least one skill', 'error');
      return;
    }

    try {
      setLoading(true);
      const skillsPayload = selectedSkills.map(s => ({
        skill_id: s.skill_id,
        proficiency: s.proficiency
      }));

      await API.skills.saveUserSkills(skillsPayload);
      const response = await API.careers.getRecommendations();
      const newRecommendations = response.data.careers || [];

      setRecommendations(newRecommendations);
      setStep(2);

      localStorage.setItem('career_recommendations', JSON.stringify({
        recommendations: newRecommendations,
        step: 2,
        timestamp: new Date().toISOString()
      }));

      // Show bookmark tip
      setShowBookmarkTip(true);
      setTimeout(() => setShowBookmarkTip(false), 5000);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to generate recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCareer = async (careerId) => {
    try {
      if (savedCareerIds.has(careerId)) {
        await API.careers.unsave(careerId);
        setSavedCareerIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(careerId);
          return newSet;
        });
        showToast('Career removed from bookmarks', 'success');
      } else {
        await API.careers.save(careerId);
        setSavedCareerIds(prev => new Set([...prev, careerId]));
        showToast('Career bookmarked successfully!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save career', 'error');
    }
  };

  const handleBackToRecommendations = () => {
    setStep(1);
    localStorage.setItem('career_recommendations', JSON.stringify({
      recommendations,
      step: 1,
      timestamp: new Date().toISOString()
    }));
  };

  const handleEmailReport = async (careerId) => {
    try {
      setLoading(true);
      const response = await API.careers.emailReport(careerId);
      if (response.data.success) {
        showToast('📧 Career report sent to your email!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send email', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (careerId, careerTitle) => {
    try {
      setLoading(true);
      const response = await API.careers.downloadPDF(careerId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `career_report_${careerTitle.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('📄 PDF downloaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to download PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSkillGap = (careerId) => {
    navigate(`/skill-gap/${careerId}`);
  };

  const handleToggleComparison = (career) => {
    if (selectedForComparison.find(c => c.id === career.id)) {
      setSelectedForComparison(selectedForComparison.filter(c => c.id !== career.id));
    } else {
      if (selectedForComparison.length >= 4) {
        showToast('You can compare up to 4 careers only', 'error');
        return;
      }
      setSelectedForComparison([...selectedForComparison, career]);
    }
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      showToast('Please select at least 2 careers to compare', 'error');
      return;
    }
    setShowComparisonModal(true);
  };

  // Loading State
  if (loading && Object.keys(allSkills).length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="mt-4 text-indigo-400 font-medium">Loading Skills...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-900/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.03 }}></div>
      </div>

      <SEO
        title="Career Recommendations"
        description="Get personalized career recommendations based on your skills. Discover career paths that match your profile with AI-powered analysis."
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4"
          >
            {step === 1 ? 'Design Your Future' : 'Your Career Path'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            {step === 1
              ? 'Select your core competencies to let our AI construct your ideal career trajectory.'
              : `We've identified ${recommendations.length} potential career matches tailored to your unique skill profile.`}
          </motion.p>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SkillSelection
                skills={allSkills}
                selectedSkills={selectedSkills}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSkillToggle={handleSkillToggle}
                onProficiencyChange={handleProficiencyChange}
                onClearSkills={handleClearSkills}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CareerResults
                recommendations={recommendations}
                selectedForComparison={selectedForComparison}
                savedCareerIds={savedCareerIds}
                onToggleComparison={handleToggleComparison}
                onCompare={handleCompare}
                onClearComparison={() => setSelectedForComparison([])}
                onSaveCareer={handleSaveCareer}
                onBack={handleBackToRecommendations}
                loading={loading}
                onEmailReport={handleEmailReport}
                onDownloadPDF={handleDownloadPDF}
                onViewSkillGap={handleViewSkillGap}
                onViewDetails={(id) => navigate(`/careers/${id}`)}
                onGetExpertGuidance={() => navigate('/experts')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {showComparisonModal && (
        <CareerComparisonModal
          careers={selectedForComparison}
          onClose={() => setShowComparisonModal(false)}
        />
      )}

      {/* Bookmark Tip Notification */}
      <AnimatePresence>
        {showBookmarkTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-sm" />
              <span className="text-2xl relative z-10">💡</span>
              <div className="relative z-10">
                <p className="font-bold text-sm uppercase tracking-wider text-indigo-100">Pro Tip</p>
                <p className="text-sm font-medium">Bookmark careers to track them in your dashboard.</p>
              </div>
              <button
                onClick={() => setShowBookmarkTip(false)}
                className="ml-2 bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors relative z-10"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerRecommendation;

