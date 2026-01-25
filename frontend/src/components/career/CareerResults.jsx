import { motion } from 'framer-motion';
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
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center"
                >
                    <div className="mb-6 text-6xl">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        We couldn't find any careers matching your exact skill set. Try adding more skills or adjusting your proficiency levels.
                    </p>
                    <Button onClick={onBack}>
                        Update Skills
                    </Button>
                </motion.div>
            ) : (
                <>
                    {/* Comparison Bar */}
                    {selectedForComparison.length > 0 && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="sticky top-4 z-40"
                        >
                            <div className="bg-[#0f172a] border border-indigo-500/30 text-white p-4 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md bg-opacity-90">
                                <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                                    <span className="font-bold whitespace-nowrap text-indigo-400">
                                        Compare ({selectedForComparison.length})
                                    </span>
                                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                                        {selectedForComparison.map(career => (
                                            <motion.div
                                                key={career.id}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="px-3 py-1 bg-gray-800 rounded-full text-xs border border-gray-700 whitespace-nowrap flex items-center gap-2"
                                            >
                                                {career.title}
                                                <button
                                                    onClick={() => onToggleComparison(career)}
                                                    className="hover:text-red-400"
                                                >
                                                    ×
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto shrink-0">
                                    <button
                                        onClick={onCompare}
                                        disabled={selectedForComparison.length < 2}
                                        className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
                                    >
                                        Compare Now
                                    </button>
                                    <button
                                        onClick={onClearComparison}
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </motion.div>
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

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center pt-8"
                    >
                        <p className="text-gray-500 mb-4">Want to try a different combination?</p>
                        <button
                            onClick={onBack}
                            className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all"
                        >
                            ← Adjust Skills
                        </button>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default CareerResults;
