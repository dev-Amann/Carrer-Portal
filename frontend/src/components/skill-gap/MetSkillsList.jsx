const MetSkillsList = ({ skills }) => {
    if (!skills || skills.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8 text-center shadow-sm">
                <p className="text-slate-500">You haven't mastered any of the required skills yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                Skills You Have <span className="text-base font-normal text-slate-500">({skills.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors group"
                    >
                        <div>
                            <h3 className="font-semibold text-slate-900">{skill.skill_name}</h3>
                            <p className="text-xs text-slate-500 capitalize mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {skill.category}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Level</div>
                            <div className="font-semibold text-green-700 capitalize text-sm bg-green-100 px-2 py-0.5 rounded border border-green-200">
                                {skill.current_level}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MetSkillsList;
