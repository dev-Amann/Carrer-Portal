const CareerInfo = ({ description, roadmap, learningResources = [] }) => {
    return (
        <div className="space-y-8 mb-10">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    Role Overview
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                    {description}
                </p>
            </div>

            {roadmap && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 border-l-4 border-l-purple-500 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        Learning Roadmap
                    </h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                        {roadmap}
                    </p>
                </div>
            )}

            {learningResources.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 border-l-4 border-l-emerald-500 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        Learning Resources
                        <span className="ml-auto text-xs font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                            from roadmap.sh
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {learningResources.map((resource) => (
                            <a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                                        {resource.title}
                                    </p>
                                    <p className="text-xs text-slate-400 capitalize">{resource.resource_type}</p>
                                </div>
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerInfo;
