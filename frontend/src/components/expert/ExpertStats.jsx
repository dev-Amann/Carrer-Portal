const ExpertStats = ({ earnings }) => {
    if (!earnings) return null;

    const stats = [
        {
            label: "Total Earnings",
            value: `₹${earnings.total_earnings.toLocaleString()}`,
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: "bg-emerald-50",
            border: "border-slate-200"
        },
        {
            label: "Pending Earnings",
            value: `₹${earnings.pending_earnings.toLocaleString()}`,
            icon: (
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: "bg-amber-50",
            border: "border-slate-200"
        },
        {
            label: "Total Bookings",
            value: earnings.total_bookings,
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            bg: "bg-blue-50",
            border: "border-slate-200"
        },
        {
            label: "Upcoming Session",
            value: earnings.upcoming_bookings,
            icon: (
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
            bg: "bg-violet-50",
            border: "border-slate-200"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                            {stat.icon}
                        </div>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

export default ExpertStats;
