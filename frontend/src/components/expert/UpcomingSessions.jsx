import { motion } from 'framer-motion';
import { format } from 'date-fns';

const UpcomingSessions = ({ bookings }) => {
    // Filter for upcoming bookings locally if needed, but assuming prop passed is already filtered or raw list
    // The parent component passed all bookings, we need to filter
    const upcomingBookings = bookings.filter(b =>
        new Date(b.slot_start) > new Date() &&
        ['pending', 'confirmed'].includes(b.status)
    ).slice(0, 5);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            confirmed: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
        >
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                    Upcoming Sessions
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded text-gray-400 border border-white/5">
                    {upcomingBookings.length} sessions
                </span>
            </div>
            <div className="divide-y divide-white/5">
                {upcomingBookings.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400">No upcoming bookings schedule</p>
                    </div>
                ) : (
                    upcomingBookings.map((booking, idx) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-6 py-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 pointer-events-none select-none shadow-inner">
                                        {booking.user?.name?.[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">
                                            {booking.user?.name}
                                        </h4>
                                        <p className="text-xs text-indigo-400 mt-0.5 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {format(new Date(booking.slot_start), 'PPp')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </div>
                                    {booking.payment && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            ₹{booking.payment.amount} • {booking.payment.status}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default UpcomingSessions;
