import { motion } from 'framer-motion';
import { format } from 'date-fns';

const BookingsTable = ({ bookings, filter, onFilterChange }) => {
    const getFilteredBookings = () => {
        if (filter === 'all') return bookings;
        if (filter === 'upcoming') {
            return bookings.filter(b => new Date(b.slot_start) > new Date());
        }
        return bookings.filter(b => b.status === filter);
    };

    const filteredBookings = getFilteredBookings();

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
            className="glass-card overflow-hidden"
        >
            <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-bold text-white">All Bookings</h3>
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="pl-4 pr-10 py-2 border border-white/10 rounded-lg text-sm bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
                    >
                        <option value="all">All Bookings</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    No bookings found for the selected filter.
                                </td>
                            </tr>
                        ) : filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{booking.user?.name}</div>
                                    <div className="text-xs text-gray-500">{booking.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    <div className="text-white font-medium">{format(new Date(booking.slot_start), 'PP')}</div>
                                    <div className="text-xs opacity-70">{format(new Date(booking.slot_start), 'p')} - {format(new Date(booking.slot_end), 'p')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {booking.payment ? (
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">₹{booking.payment.amount}</span>
                                            <span className={`text-[10px] uppercase font-bold mt-0.5 ${booking.payment.status === 'completed' ? 'text-green-500' :
                                                booking.payment.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                                                }`}>
                                                {booking.payment.status}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-600 italic">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {booking.jitsi_room && booking.status === 'confirmed' ? (
                                        <a
                                            href={`https://meet.jit.si/${booking.jitsi_room}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                                        >
                                            Join Meeting
                                        </a>
                                    ) : (
                                        <span className="text-gray-600 text-xs">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default BookingsTable;
