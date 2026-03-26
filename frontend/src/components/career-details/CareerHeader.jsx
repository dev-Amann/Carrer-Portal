const CareerHeader = ({ title, salaryRange, demandLevel }) => {
    const getDemandBadgeColor = (level) => {
        switch (level) {
            case 'very_high': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'high': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {title}
            </h1>

            <div className="flex flex-wrap gap-4">
                {/* Salary */}
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Salary Range</p>
                        <p className="font-semibold text-slate-900">{salaryRange || 'N/A'}</p>
                    </div>
                </div>

                {/* Demand */}
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Market Demand</p>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded textxs font-bold border uppercase ${getDemandBadgeColor(demandLevel)}`}>
                                {demandLevel?.replace('_', ' ') || 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerHeader;
