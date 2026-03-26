import Button from '../ui/Button';

const BookingsList = ({ bookings, onJoinCall, onLeaveFeedback }) => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadgeClass = (status) => {
        const baseClasses = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border';
        switch (status) {
            case 'confirmed':
                return `${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-100`;
            case 'completed':
                return `${baseClasses} bg-indigo-50 text-indigo-700 border-indigo-100`;
            case 'cancelled':
                return `${baseClasses} bg-rose-50 text-rose-700 border-rose-100`;
            default:
                return `${baseClasses} bg-slate-100 text-slate-600 border-slate-200`;
        }
    };

    return (
        <div className="space-y-6">
            {bookings.map((booking) => (
                <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 relative group"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100">
                                    {booking.expert?.name?.[0] || 'E'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {booking.expert?.name || 'Expert Consultation'}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">{booking.expert?.role || 'Expert'}</p>
                                </div>
                                <div className="ml-auto md:ml-4">
                                    <span className={getStatusBadgeClass(booking.status)}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="mr-3 p-2 bg-white rounded-lg border border-slate-100 text-indigo-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wide">Start Time</span>
                                        <span className="text-sm font-semibold text-slate-700">{formatDateTime(booking.slot_start)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="mr-3 p-2 bg-white rounded-lg border border-slate-100 text-indigo-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wide">End Time</span>
                                        <span className="text-sm font-semibold text-slate-700">{formatDateTime(booking.slot_end)}</span>
                                    </div>
                                </div>

                                {booking.expert?.rate_per_hour && (
                                    <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="mr-3 p-2 bg-white rounded-lg border border-slate-100 text-green-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wide">Rate</span>
                                            <span className="text-sm font-semibold text-slate-700">₹{booking.expert.rate_per_hour}/hr</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px] justify-center md:border-l md:border-slate-100 md:pl-6">
                            {booking.status === 'confirmed' && booking.jitsi_room && (
                                <Button
                                    onClick={() => onJoinCall(booking)}
                                    variant="primary"
                                    className="w-full flex items-center justify-center gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Join Call
                                </Button>
                            )}
                            {booking.status === 'pending' && (
                                <div className="text-center py-2 px-4 bg-amber-50 border border-amber-100 rounded-lg">
                                    <p className="text-amber-700 text-xs font-bold uppercase tracking-wide">Pending Approval</p>
                                </div>
                            )}
                            {booking.status === 'completed' && (
                                <div className="flex flex-col gap-2">
                                    <div className="text-center py-2 px-4 bg-slate-50 border border-slate-100 rounded-lg">
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Completed</p>
                                    </div>

                                    {booking.has_feedback ? (
                                        <div className="flex items-center justify-center gap-1 py-1.5 px-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100 text-sm font-medium">
                                            <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span>Rated {booking.feedback?.rating}/5</span>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => onLeaveFeedback(booking)}
                                            variant="outline"
                                            size="sm"
                                            className="w-full flex items-center justify-center gap-2 border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-300"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            Leave Feedback
                                        </Button>
                                    )}
                                </div>
                            )}
                            {booking.status === 'cancelled' && (
                                <div className="text-center py-2 px-4 bg-rose-50 border border-rose-100 rounded-lg">
                                    <p className="text-rose-500 text-xs font-bold uppercase tracking-wide">Cancelled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingsList;
