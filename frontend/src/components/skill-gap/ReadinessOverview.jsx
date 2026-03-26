const ReadinessOverview = ({ readinessPercentage, metSkillsCount, totalRequiredSkills }) => {
    return (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-8 mb-8 text-slate-900 relative overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-900">
                        Career Readiness
                        {readinessPercentage >= 80 && <span className="text-2xl">🚀</span>}
                    </h2>
                    <p className="text-lg text-slate-600">
                        You meet <span className="text-slate-900 font-bold">{metSkillsCount}</span> out of <span className="text-slate-900 font-bold">{totalRequiredSkills}</span> required skills
                    </p>

                    <div className="mt-4 w-full md:w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            style={{ width: `${readinessPercentage}%` }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-1000 ease-out"
                        />
                    </div>
                </div>

                <div className="text-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[120px]">
                    <div className="text-5xl font-bold text-slate-800">
                        {readinessPercentage}%
                    </div>
                    <div className="text-sm font-medium text-emerald-600 mt-1 uppercase tracking-wider">
                        Match Score
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadinessOverview;
