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
        <div
            className={`bg-white border rounded-xl p-6 relative group overflow-hidden transition-all shadow-sm hover:shadow-md ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200'
                }`}
        >
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
                            ? 'bg-indigo-600 border-indigo-600 scale-110'
                            : 'border-slate-400 hover:border-indigo-400'
                            }`}>
                            {isSelected && (
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        {/* Tooltip */}
                        <span className="absolute left-8 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/check:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Compare
                        </span>
                    </label>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-slate-300 select-none">#{index + 1}</span>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {career.title}
                                </h3>
                            </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                            onClick={() => onSave(career.id)}
                            className={`p-2 rounded-full transition-all duration-300 ${isSaved
                                ? 'bg-orange-50 text-orange-500'
                                : 'text-slate-300 hover:text-orange-400 hover:bg-slate-50'
                                }`}
                            title={isSaved ? 'Remove from bookmarks' : 'Bookmark this career'}
                        >
                            {isSaved ? (
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <p className="text-slate-600 mb-5 leading-relaxed">
                        {career.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Salary Range</span>
                            <span className="font-semibold text-slate-900">
                                {career.salary_range || 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Demand</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${career.demand_level === 'very_high' ? 'bg-emerald-500 shadow-sm' :
                                    career.demand_level === 'high' ? 'bg-blue-500' :
                                        'bg-yellow-500'
                                    }`} />
                                <span className="capitalize text-slate-900 font-medium"> {career.demand_level?.replace('_', ' ') || 'Normal'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Relevant Skills</span>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-200 rounded-full min-w-[60px] overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full"
                                        style={{ width: `${(career.matched_skills / career.total_required_skills) * 100}%` }}
                                    />
                                </div>
                                <span className="font-semibold text-slate-900">
                                    {career.matched_skills}/{career.total_required_skills}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Match Score Section */}
                <div className="flex flex-col items-center justify-center lg:pl-6 lg:border-l border-slate-100 min-w-[120px]">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-slate-100"
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
                                className={`transition-all duration-1000 ease-out ${career.match_score >= 80 ? 'text-emerald-500' :
                                    career.match_score >= 50 ? 'text-indigo-600' : 'text-amber-500'
                                    }`}
                            />
                        </svg>
                        <span className="absolute text-2xl font-bold text-slate-900">
                            {career.match_score}<span className="text-sm text-slate-400">%</span>
                        </span>
                    </div>

                    <div className="flex gap-2 w-full justify-center">
                        <button
                            onClick={() => onEmail(career.id)}
                            disabled={loading}
                            className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 group"
                            title="Email Report"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDownload(career.id, career.title)}
                            disabled={loading}
                            className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 group"
                            title="Download PDF"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
                <button
                    onClick={() => onViewSkillGap(career.id)}
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg transition-all font-medium text-sm text-center flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Skill Gap
                </button>
                <Button
                    onClick={onGetExpertGuidance}
                    className="w-full justify-center text-sm py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Get Expert Guidance
                </Button>
                <button
                    onClick={() => onViewDetails(career.id)}
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 group/btn"
                >
                    Details
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CareerCard;
