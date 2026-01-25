import { motion } from 'framer-motion';
import Button from '../ui/Button';

const CareerCard = ({
    career,
    index,
    isSelected,
    isSaved,
    onToggleComparison,
    onSave,
    onEmail,
    onDownload,
    onViewSkillGap,
    onViewDetails,
    onGetExpertGuidance,
    loading
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-6 relative group overflow-hidden ${isSelected ? 'ring-2 ring-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]' : ''
                }`}
        >
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />

            <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Checkbox Section */}
                <div className="pt-1">
                    <label className="flex items-center cursor-pointer relative group/check">
                        <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => onToggleComparison(career)}
                            className="peer sr-only"
                        />
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${isSelected
                            ? 'bg-indigo-500 border-indigo-500 scale-110'
                            : 'border-gray-500 hover:border-indigo-400'
                            }`}>
                            {isSelected && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </motion.svg>
                            )}
                        </div>
                        {/* Tooltip */}
                        <span className="absolute left-8 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/check:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Compare
                        </span>
                    </label>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-white/5 select-none">#{index + 1}</span>
                            <div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    {career.title}
                                </h3>
                            </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                            onClick={() => onSave(career.id)}
                            className={`text-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${isSaved
                                ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]'
                                : 'text-gray-600 hover:text-orange-400'
                                }`}
                            title={isSaved ? 'Remove from bookmarks' : 'Bookmark this career'}
                        >
                            <span className={isSaved ? 'fill-current' : ''}>{isSaved ? '★' : '☆'}</span>
                        </button>
                    </div>

                    <p className="text-gray-400 mb-5 leading-relaxed">
                        {career.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-800/20 border border-white/5 rounded-xl p-4 mb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Salary Range</span>
                            <span className="font-semibold text-white/90">
                                {career.salary_range || 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Demand</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${career.demand_level === 'very_high' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
                                    career.demand_level === 'high' ? 'bg-blue-400' :
                                        'bg-yellow-400'
                                    }`} />
                                <span className="capitalize text-white/90"> {career.demand_level?.replace('_', ' ') || 'Normal'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Relevant Skills</span>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-700 rounded-full min-w-[60px]">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                        style={{ width: `${(career.matched_skills / career.total_required_skills) * 100}%` }}
                                    />
                                </div>
                                <span className="font-semibold text-white/90">
                                    {career.matched_skills}/{career.total_required_skills}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Match Score Section */}
                <div className="flex flex-col items-center justify-center lg:pl-6 lg:border-l border-white/5 min-w-[120px]">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-2">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-800"
                                fill="none"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * career.match_score) / 100}
                                className="text-indigo-500 transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-2xl font-bold text-white">
                            {career.match_score}<span className="text-sm text-gray-400">%</span>
                        </span>
                    </div>

                    <div className="flex gap-2 w-full justify-center">
                        <button
                            onClick={() => onEmail(career.id)}
                            disabled={loading}
                            className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                            title="Email Report"
                        >
                            📧
                        </button>
                        <button
                            onClick={() => onDownload(career.id, career.title)}
                            disabled={loading}
                            className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                            title="Download PDF"
                        >
                            📄
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/5">
                <button
                    onClick={() => onViewSkillGap(career.id)}
                    className="px-4 py-2.5 bg-gray-800/50 hover:bg-indigo-600/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 hover:border-indigo-500/50 rounded-lg transition-all font-medium text-sm text-center"
                >
                    View Skill Gap
                </button>
                <Button
                    onClick={onGetExpertGuidance}
                    variant="gradient"
                    className="w-full justify-center text-sm py-2.5"
                >
                    👨‍🏫 Get Expert Guidance
                </Button>
                <button
                    onClick={() => onViewDetails(career.id)}
                    className="px-4 py-2.5 bg-gray-800/50 hover:bg-white/10 text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 group/btn"
                >
                    Details
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </motion.div>
    );
};

export default CareerCard;
