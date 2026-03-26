import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const BookingsTable = ({ bookings, filter, onFilterChange }) => {
    const navigate = useNavigate();

    const getFilteredBookings = () => {
        if (filter === 'all') return bookings;
        if (filter === 'upcoming') {
            return bookings.filter(b => new Date(b.slot_start) > new Date());
        }
        return bookings.filter(b => b.status === filter);
    };

    const filteredBookings = getFilteredBookings();

    const getStatusStyles = (status) => {
        const styles = {
            pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: '⏰' },
            confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✅' },
            completed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '🎉' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: '❌' },
        };
        return styles[status] || { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: '•' };
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">All Bookings</h3>
                    <p className="text-sm text-slate-500">Manage your past and upcoming sessions</p>
                </div>

                <div className="relative group">
                    <select
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        <option value="all">All Bookings</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-slate-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Review</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-500 font-medium">No bookings found</p>
                                    <p className="text-slate-400 text-sm mt-1">Try changing the filter or wait for new bookings.</p>
                                </td>
                            </tr>
                        ) : filteredBookings.map((booking) => {
                            const statusStyle = getStatusStyles(booking.status);
                            return (
                                <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                                {booking.user?.name?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{booking.user?.name}</div>
                                                <div className="text-xs text-slate-500">{booking.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-medium flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {format(new Date(booking.slot_start), 'MMM d, yyyy')}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-0.5 ml-5">
                                                {format(new Date(booking.slot_start), 'p')} - {format(new Date(booking.slot_end), 'p')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                            <span>{statusStyle.icon}</span>
                                            <span className="capitalize">{booking.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {booking.payment ? (
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-bold">₹{booking.payment.amount}</span>
                                                <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${booking.payment.status === 'completed' ? 'text-emerald-600' :
                                                    booking.payment.status === 'failed' ? 'text-red-600' : 'text-amber-600'
                                                    }`}>
                                                    {booking.payment.status}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">No Payment</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {booking.has_feedback ? (
                                            <div className="group relative cursor-pointer">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="font-semibold text-slate-900">{booking.feedback?.rating}</span>
                                                </div>
                                                {booking.feedback?.comment && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                                        "{booking.feedback.comment}"
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {booking.jitsi_room && booking.status === 'confirmed' ? (
                                            <Button
                                                onClick={() => navigate(`/meeting/${booking.jitsi_room}`)}
                                                size="sm"
                                                className="shadow-sm hover:shadow-indigo-200"
                                            >
                                                Join
                                            </Button>
                                        ) : booking.status === 'completed' ? (
                                            <span className="text-emerald-600 text-xs font-semibold px-3 py-1 bg-emerald-50 rounded-lg">
                                                Finished
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 text-lg select-none">•••</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingsTable;
