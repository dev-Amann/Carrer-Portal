const EarningsSummary = ({ earnings }) => {
    if (!earnings) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                Financial Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Earnings Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Earnings</p>
                            <h2 className="text-3xl font-bold text-slate-900">
                                ₹{earnings.total_earnings.toLocaleString()}
                            </h2>
                            <p className="text-xs text-slate-400 mt-2">
                                Lifetime earnings from {earnings.total_bookings} sessions
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pending Earnings Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending Clearance</p>
                            <h3 className="text-3xl font-bold text-slate-900">
                                ₹{earnings.pending_earnings.toLocaleString()}
                            </h3>
                            {earnings.pending_earnings > 0 && (
                                <p className="text-xs text-amber-600 mt-2 font-medium bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-100">
                                    Available after session completion
                                </p>
                            )}
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Completed Transactions Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Completed Payouts</p>
                            <h3 className="text-3xl font-bold text-slate-900">
                                {earnings.completed_transactions}
                            </h3>
                            <p className="text-xs text-slate-400 mt-2">Successful transactions processed</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Hourly Rate Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hourly Rate</p>
                            <h3 className="text-3xl font-bold text-slate-900">
                                ₹{earnings.rate_per_hour}
                            </h3>
                            <p className="text-xs text-slate-400 mt-2">Current rate per session</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsSummary;
