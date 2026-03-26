import useCareerRecommendation from '../hooks/useCareerRecommendation';

// Components
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import CareerComparisonModal from '../components/CareerComparisonModal';
import SkillSelection from '../components/career/SkillSelection';
import CareerResults from '../components/career/CareerResults';

const CareerRecommendation = () => {
  const {
    step,
    allSkills,
    selectedSkills,
    searchTerm,
    loading,
    recommendations,
    toast,
    selectedForComparison,
    showComparisonModal,
    savedCareerIds,
    showBookmarkTip,
    setSearchTerm,
    setToast,
    setSelectedForComparison,
    setShowComparisonModal,
    setShowBookmarkTip,
    handleSkillToggle,
    handleProficiencyChange,
    handleClearSkills,
    handleSubmit,
    handleSaveCareer,
    handleBackToRecommendations,
    handleEmailReport,
    handleDownloadPDF,
    handleViewSkillGap,
    handleToggleComparison,
    handleCompare,
    navigate
  } = useCareerRecommendation();

  // Loading State
  if (loading && Object.keys(allSkills).length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-500 font-medium">Loading Skills...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO
        title="Career Recommendations"
        description="Get personalized career recommendations based on your skills. Discover career paths that match your profile with AI-powered analysis."
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {step === 1 ? 'Design Your Future' : 'Your Career Path'}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {step === 1
              ? 'Select your core competencies to let our AI construct your ideal career trajectory.'
              : `We've identified ${recommendations.length} potential career matches tailored to your unique skill profile.`}
          </p>
        </div>

        {/* Content Area */}
        {step === 1 ? (
          <div>
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
          </div>
        ) : (
          <div>
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
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4">
            <svg className="w-6 h-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <p className="font-bold text-sm uppercase tracking-wider text-indigo-100">Pro Tip</p>
              <p className="text-sm font-medium">Bookmark careers to track them in your dashboard.</p>
            </div>
            <button
              onClick={() => setShowBookmarkTip(false)}
              className="ml-2 bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRecommendation;
