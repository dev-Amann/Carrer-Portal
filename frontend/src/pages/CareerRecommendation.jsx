import { useState, useEffect } from 'react';
// Force rebuild
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import CareerComparisonModal from '../components/CareerComparisonModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CareerRecommendation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      // Force show the form
      setStep(1);
      localStorage.removeItem('career_recommendations');
    } else {
      // Load previous recommendations only if not coming from dashboard
      loadPreviousRecommendations();
    }
  }, []);

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
      // User might not have skills yet, that's okay
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSkills.length === 0) {
      showToast('Please select at least one skill', 'error');
      return;
    }

    try {
      setLoading(true);

      // Save user skills
      const skillsPayload = selectedSkills.map(s => ({
        skill_id: s.skill_id,
        proficiency: s.proficiency
      }));

      await API.skills.saveUserSkills(skillsPayload);

      // Get recommendations
      const response = await API.careers.getRecommendations();
      const newRecommendations = response.data.careers || [];
      setRecommendations(newRecommendations);
      setStep(2);

      // Save recommendations to localStorage
      localStorage.setItem('career_recommendations', JSON.stringify({
        recommendations: newRecommendations,
        step: 2,
        timestamp: new Date().toISOString()
      }));

      // Show bookmark tip modal
      setShowBookmarkTip(true);
      setTimeout(() => setShowBookmarkTip(false), 5000); // Auto-hide after 5 seconds
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to generate recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCareer = async (careerId) => {
    try {
      if (savedCareerIds.has(careerId)) {
        // Unsave
        await API.careers.unsave(careerId);
        setSavedCareerIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(careerId);
          return newSet;
        });
        showToast('Career removed from bookmarks', 'success');
      } else {
        // Save
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
    // Update localStorage
    localStorage.setItem('career_recommendations', JSON.stringify({
      recommendations,
      step: 1,
      timestamp: new Date().toISOString()
    }));
  };

  const handleClearSkills = () => {
    setSelectedSkills([]);
    showToast('All skills cleared', 'success');
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

      // Create download link
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

  // Filter skills based on search term
  const getFilteredSkills = () => {
    if (!searchTerm) return allSkills;

    const filtered = {};
    Object.keys(allSkills).forEach(category => {
      const matchingSkills = allSkills[category].filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingSkills.length > 0) {
        filtered[category] = matchingSkills;
      }
    });
    return filtered;
  };

  const filteredSkills = getFilteredSkills();

  if (loading && Object.keys(allSkills).length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>
      <SEO
        title="Career Recommendations"
        description="Get personalized career recommendations based on your skills. Discover career paths that match your profile with AI-powered analysis."
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {step === 1 ? 'Select Your Skills' : 'Your Career Recommendations'}
          </h1>
          <p className="text-lg text-gray-400">
            {step === 1
              ? 'Choose your skills and proficiency levels to get personalized career recommendations'
              : `We found ${recommendations.length} career matches based on your skills`}
          </p>
        </div>

        {/* Step 1: Skills Selection */}
        {step === 1 && (
          <div className="glass-card p-6 animate-fade-in-up">
            {/* Search Bar */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                as="input"
              />
            </div>

            {/* Selected Skills Summary */}
            {selectedSkills.length > 0 && (
              <div className="mb-6 p-4 bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    Selected Skills ({selectedSkills.length})
                  </h3>
                  <button
                    onClick={handleClearSkills}
                    className="px-3 py-1 text-xs bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skill => (
                    <div
                      key={skill.skill_id}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-800 text-blue-200 rounded-full text-sm"
                    >
                      <span>{skill.name}</span>
                      <select
                        value={skill.proficiency}
                        onChange={(e) => handleProficiencyChange(skill.skill_id, e.target.value)}
                        className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                      <button
                        onClick={() => handleSkillToggle(skill.skill_id, skill.name, skill.category)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills by Category */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 max-h-[500px] overflow-y-auto">
                {Object.keys(filteredSkills).length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    No skills found matching "{searchTerm}"
                  </p>
                ) : (
                  Object.keys(filteredSkills).map(category => (
                    <div key={category} className="border-b border-gray-700 pb-4">
                      <h3 className="text-lg font-semibold text-white mb-3 capitalize">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredSkills[category].map(skill => {
                          const isSelected = selectedSkills.some(s => s.skill_id === skill.id);
                          return (
                            <label
                              key={skill.id}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                                ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSkillToggle(skill.id, skill.name, category)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="ml-3 text-sm text-white">
                                {skill.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading || selectedSkills.length === 0}
                  isLoading={loading}
                >
                  Get Recommendations
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Recommendations */}
        {step === 2 && (
          <div className="space-y-6">
            {recommendations.length === 0 ? (
              <div className="glass-card p-12 text-center animate-fade-in">
                <p className="text-gray-400 mb-4">
                  No career matches found. Try adding more skills or adjusting proficiency levels.
                </p>
                <Button
                  onClick={handleBackToRecommendations}
                >
                  Update Skills
                </Button>
              </div>
            ) : (
              <>
                {/* Comparison Bar */}
                {selectedForComparison.length > 0 && (
                  <div className="sticky top-0 z-10 bg-blue-700 text-white p-4 rounded-lg shadow-lg mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          {selectedForComparison.length} career{selectedForComparison.length > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex gap-2">
                          {selectedForComparison.map(career => (
                            <span key={career.id} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                              {career.title}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCompare}
                          disabled={selectedForComparison.length < 2}
                          className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Compare Careers
                        </button>
                        <button
                          onClick={() => setSelectedForComparison([])}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {recommendations.map((career, index) => {
                  const isSelected = selectedForComparison.find(c => c.id === career.id);
                  const isSaved = savedCareerIds.has(career.id);
                  return (
                    <div
                      key={career.id}
                      className={`glass-card p-6 hover:border-indigo-500/50 transition-all ${isSelected ? 'ring-2 ring-indigo-500' : ''
                        }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {/* Comparison Checkbox */}
                        <label className="flex items-center cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => handleToggleComparison(career)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </label>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                            <h3 className="text-2xl font-bold text-white">
                              {career.title}
                            </h3>
                            {/* Bookmark/Save Icon */}
                            <button
                              onClick={() => handleSaveCareer(career.id)}
                              className={`ml-auto text-2xl transition-all ${isSaved
                                ? 'text-orange-500 hover:text-orange-600'
                                : 'text-gray-300 hover:text-orange-500'
                                }`}
                              title={isSaved ? 'Remove bookmark' : 'Bookmark career'}
                            >
                              🔥
                            </button>
                          </div>
                          <p className="text-gray-400 mb-3">
                            {career.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Salary:</span>
                              <span className="font-semibold text-white">
                                {career.salary_range || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Demand:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${career.demand_level === 'very_high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                career.demand_level === 'high' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  career.demand_level === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }`}>
                                {career.demand_level.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Skills Match:</span>
                              <span className="font-semibold text-white">
                                {career.matched_skills}/{career.total_required_skills}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-400">
                            {career.match_score}%
                          </div>
                          <div className="text-xs text-gray-400 mb-2">Match</div>
                          {/* Email & PDF buttons - small and compact */}
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleEmailReport(career.id)}
                              disabled={loading}
                              className="p-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
                              title="Email Report"
                            >
                              📧
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(career.id, career.title)}
                              disabled={loading}
                              className="p-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                              title="Download PDF"
                            >
                              📄
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          onClick={() => handleViewSkillGap(career.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Skill Gap
                        </button>
                        <Button
                          onClick={() => navigate('/experts')}
                          variant="gradient"
                          className="w-full justify-center"
                        >
                          👨‍🏫 Get Expert Guidance
                        </Button>
                        <button
                          onClick={() => navigate(`/careers/${career.id}`)}
                          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="text-center">
                  <button
                    onClick={handleBackToRecommendations}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                  >
                    Go Back to Recommendations
                  </button>
                </div>
              </>
            )}
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

      {showComparisonModal && (
        <CareerComparisonModal
          careers={selectedForComparison}
          onClose={() => setShowComparisonModal(false)}
        />
      )}

      {/* Bookmark Tip Notification */}
      {showBookmarkTip && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-lg shadow-2xl max-w-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-bold text-lg mb-1">Pro Tip!</p>
                <p className="text-sm">Click the fire icon next to any career to bookmark it for later viewing in your dashboard.</p>
              </div>
              <button
                onClick={() => setShowBookmarkTip(false)}
                className="ml-2 text-white hover:text-gray-200 text-xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRecommendation;
