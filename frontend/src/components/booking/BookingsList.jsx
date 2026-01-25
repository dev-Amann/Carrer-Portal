import { motion } from 'framer-motion';
import Button from '../ui/Button';

const BookingsList = ({ bookings, onJoinCall }) => {
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
                return `${baseClasses} bg-green-500/10 text-green-400 border-green-500/20`;
            case 'completed':
                return `${baseClasses} bg-blue-500/10 text-blue-400 border-blue-500/20`;
            case 'cancelled':
                return `${baseClasses} bg-red-500/10 text-red-400 border-red-500/20`;
            default:
                return `${baseClasses} bg-gray-500/10 text-gray-400 border-gray-500/20`;
        }
    };

    return (
        <div className="space-y-6">
            {bookings.map((booking, index) => (
                <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-xl p-6 hover:border-indigo-500/30 transition-all border border-white/5 relative group"
                >
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-10 transition duration-500" />

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                    {booking.expert?.name?.[0] || 'E'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {booking.expert?.name || 'Expert Consultation'}
                                    </h3>
                                    <p className="text-sm text-gray-400">{booking.expert?.role || 'Expert'}</p>
                                </div>
                                <span className={`ml-auto md:ml-4 ${getStatusBadgeClass(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>

                            {booking.expert?.bio && (
                                <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <p className="text-gray-400 text-sm line-clamp-2 italic">
                                        "{booking.expert.bio}"
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                                    <svg className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Start</span>
                                        <span className="font-medium">{formatDateTime(booking.slot_start)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                                    <svg className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">End</span>
                                        <span className="font-medium">{formatDateTime(booking.slot_end)}</span>
                                    </div>
                                </div>

                                {booking.expert?.rate_per_hour && (
                                    <div className="flex items-center text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                                        <svg className="h-4 w-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Rate</span>
                                            <span className="font-medium">₹{booking.expert.rate_per_hour}/hr</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px] justify-center border-l border-white/5 pl-0 md:pl-6 pt-4 md:pt-0">
                            {booking.status === 'confirmed' && booking.jitsi_room && (
                                <Button
                                    onClick={() => onJoinCall(booking)}
                                    variant="gradient"
                                    className="w-full flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Join Video Call
                                </Button>
                            )}
                            {booking.status === 'pending' && (
                                <div className="text-center py-2 px-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <p className="text-yellow-400 text-sm font-medium">Waiting for confirmation</p>
                                </div>
                            )}
                            {booking.status === 'completed' && (
                                <div className="text-center py-2 px-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <p className="text-blue-400 text-sm font-medium">Session completed</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default BookingsList;
