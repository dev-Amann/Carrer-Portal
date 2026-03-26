import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recommended Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={() => navigate('/career-recommendation')}
                    className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">Career Analysis</h3>
                        <p className="text-xs text-slate-500">Get AI-driven career path insights</p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/experts')}
                    className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 group-hover:bg-emerald-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">Browse Experts</h3>
                        <p className="text-xs text-slate-500">Connect with industry mentors</p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/bookings')}
                    className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all group text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-4 group-hover:bg-purple-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-purple-700">Consultations</h3>
                        <p className="text-xs text-slate-500">Check upcoming sessions</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
