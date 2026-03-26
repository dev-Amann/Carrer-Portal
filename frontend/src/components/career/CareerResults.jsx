import Button from '../ui/Button';
import CareerCard from './CareerCard';

const CareerResults = ({
    recommendations,
    selectedForComparison,
    savedCareerIds,
    onToggleComparison,
    onCompare,
    onClearComparison,
    onSaveCareer,
    onBack,
    loading,
    onEmailReport,
    onDownloadPDF,
    onViewSkillGap,
    onViewDetails,
    onGetExpertGuidance
}) => {
    return (
        <div className="space-y-8">
            {recommendations.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                    <div className="mb-6 text-6xl">🔍</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Matches Found</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        We couldn't find any careers matching your exact skill set. Try adding more skills or adjusting your proficiency levels.
                    </p>
                    <Button onClick={onBack} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                        Update Skills
                    </Button>
                </div>
            ) : (
                <>
                    {/* Comparison Bar */}
                    {selectedForComparison.length > 0 && (
                        <div className="sticky top-4 z-40">
                            <div className="bg-white border border-indigo-100 text-slate-900 p-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-opacity-95 backdrop-blur-sm">
                                <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                                    <span className="font-bold whitespace-nowrap text-indigo-600">
                                        Compare ({selectedForComparison.length})
                                    </span>
                                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                                        {selectedForComparison.map(career => (
                                            <div
                                                key={career.id}
                                                className="px-3 py-1 bg-indigo-50 rounded-full text-xs border border-indigo-100 whitespace-nowrap flex items-center gap-2 text-indigo-800"
                                            >
                                                {career.title}
                                                <button
                                                    onClick={() => onToggleComparison(career)}
                                                    className="hover:text-red-500 font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto shrink-0">
                                    <button
                                        onClick={onCompare}
                                        disabled={selectedForComparison.length < 2}
                                        className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                    >
                                        Compare Now
                                    </button>
                                    <button
                                        onClick={onClearComparison}
                                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition-colors border border-slate-200"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {recommendations.map((career, index) => (
                            <CareerCard
                                key={career.id}
                                career={career}
                                index={index}
                                isSelected={selectedForComparison.find(c => c.id === career.id)}
                                isSaved={savedCareerIds.has(career.id)}
                                onToggleComparison={onToggleComparison}
                                onSave={onSaveCareer}
                                onEmail={onEmailReport}
                                onDownload={onDownloadPDF}
                                onViewSkillGap={onViewSkillGap}
                                onViewDetails={onViewDetails}
                                onGetExpertGuidance={onGetExpertGuidance}
                                loading={loading}
                            />
                        ))}
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-slate-500 mb-4">Want to try a different combination?</p>
                        <button
                            onClick={onBack}
                            className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all bg-white"
                        >
                            ← Adjust Skills
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CareerResults;
