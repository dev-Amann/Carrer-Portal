const RequiredSkillsList = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                Required Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex flex-col p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{skill.skill_name}</h3>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 capitalize font-medium">
                                {skill.required_level}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 capitalize flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            {skill.category}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequiredSkillsList;
