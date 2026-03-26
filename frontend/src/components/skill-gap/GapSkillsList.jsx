import Button from '../ui/Button';

const GapSkillsList = ({ gaps, onGetGuidance }) => {
    if (!gaps) return null;

    if (gaps.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">You're Fully Qualified!</h3>
                <p className="text-slate-500">You matched all the required skills for this career.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    Skills to Develop <span className="text-base font-normal text-slate-500">({gaps.length})</span>
                </h2>

                {onGetGuidance && (
                    <Button variant="outline" size="sm" onClick={onGetGuidance} className="hidden sm:flex border-slate-300 text-slate-700 hover:bg-slate-50">
                        Find Mentors
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {gaps.map((skill, index) => (
                    <div
                        key={index}
                        className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${skill.status === 'missing'
                            ? 'bg-red-50 border-red-100 hover:border-red-200'
                            : 'bg-yellow-50 border-yellow-100 hover:border-yellow-200'
                            }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-slate-900 text-lg">{skill.skill_name}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${skill.status === 'missing'
                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        }`}>
                                        {skill.status === 'missing' ? 'Missing' : 'Improve'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 capitalize flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${skill.status === 'missing' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                    {skill.category}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 text-sm bg-white p-3 rounded-lg border border-slate-200">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider">Current</span>
                                    <span className="font-medium text-slate-900 capitalize">
                                        {skill.current_level || 'None'}
                                    </span>
                                </div>
                                <div className="w-px h-8 bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider">Target</span>
                                    <span className="font-bold text-indigo-600 capitalize">
                                        {skill.required_level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {onGetGuidance && (
                <div className="mt-6 sm:hidden">
                    <Button variant="outline" onClick={onGetGuidance} className="w-full justify-center">
                        Find Mentors
                    </Button>
                </div>
            )}
        </div>
    );
};

export default GapSkillsList;
