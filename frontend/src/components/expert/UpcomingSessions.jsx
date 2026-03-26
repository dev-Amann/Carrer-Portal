import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const UpcomingSessions = ({ bookings }) => {
    const navigate = useNavigate();

    // Filter and sort upcoming bookings
    const upcomingBookings = bookings
        .filter(b =>
            new Date(b.slot_start) > new Date() &&
            ['pending', 'confirmed'].includes(b.status)
        )
        .sort((a, b) => new Date(a.slot_start) - new Date(b.slot_start))
        .slice(0, 3); // Show top 3 only to save space

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
        return colors[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    };

    if (upcomingBookings.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Upcoming Sessions</h3>
                <p className="text-slate-500 mt-1">You don't have any sessions scheduled for the near future.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                Next Sessions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                {booking.user?.name?.[0]}
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-bold text-slate-900 text-base line-clamp-1" title={booking.user?.name}>
                                {booking.user?.name}
                            </h4>
                            <p className="text-sm text-slate-500">{booking.user?.email}</p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium mb-3">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {format(new Date(booking.slot_start), 'EEE, MMM d')}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium mb-4">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {format(new Date(booking.slot_start), 'p')} - {format(new Date(booking.slot_end), 'p')}
                            </div>

                            {booking.status === 'confirmed' && booking.jitsi_room && (
                                <Button
                                    onClick={() => navigate(`/meeting/${booking.jitsi_room}`)}
                                    className="w-full justify-center"
                                    size="sm"
                                >
                                    Join Meeting
                                </Button>
                            )}
                            {booking.status === 'pending' && (
                                <div className="text-center text-xs text-amber-600 bg-amber-50 py-2 rounded-lg border border-amber-100">
                                    Awaiting Payment
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingSessions;
