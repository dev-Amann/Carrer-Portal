import { useNavigate } from 'react-router-dom';

const StatsGrid = ({ stats }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skills Stat */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all group">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Skills</p>
                        <h3 className="text-3xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {stats.skillsCount}
                        </h3>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium cursor-pointer" onClick={() => navigate('/career-recommendation?action=update')}>
                    <span>Manage Skills</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Bookings Stat */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-100 transition-all group">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Active Bookings</p>
                        <h3 className="text-3xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {stats.bookingsCount}
                        </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium cursor-pointer" onClick={() => navigate('/bookings')}>
                    <span>View Schedule</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Saved Careers Stat */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-100 transition-all group">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Saved Careers</p>
                        <h3 className="text-3xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {stats.recommendationsCount}
                        </h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-purple-600 font-medium cursor-pointer" onClick={() => navigate('/career-recommendation')}>
                    <span>View Bookmarks</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default StatsGrid;
