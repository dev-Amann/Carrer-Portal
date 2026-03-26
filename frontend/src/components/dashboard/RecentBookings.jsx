import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const getStatusColor = (status) => {
    const colors = {
        confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        pending: 'bg-amber-50 text-amber-700 border-amber-100',
        completed: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        cancelled: 'bg-rose-50 text-rose-700 border-rose-100'
    };
    return colors[status] || 'bg-slate-50 text-slate-600 border-slate-100';
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const RecentBookings = ({ recentBookings }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Upcoming</h2>
                <button onClick={() => navigate('/bookings')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    All
                </button>
            </div>

            {recentBookings.length > 0 ? (
                <div className="space-y-4">
                    {recentBookings.map(booking => (
                        <div key={booking.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                    {booking.expert?.name?.[0] || 'E'}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">{booking.expert?.name}</h4>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatDateTime(booking.slot_start)}
                            </div>
                            {booking.status === 'confirmed' && booking.jitsi_room ? (
                                <Button onClick={() => navigate('/bookings')} size="sm" className="w-full text-xs">
                                    Join Call
                                </Button>
                            ) : (
                                <Button onClick={() => navigate('/bookings')} size="sm" variant="outline" className="w-full text-xs">
                                    View Details
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-sm">No upcoming sessions</p>
                </div>
            )}
        </div>
    );
};

export default RecentBookings;
