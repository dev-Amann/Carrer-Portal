import React from 'react';
import { DeleteIcon } from './AdminIcons';

const UserManagement = ({ users, currentUser, onDeleteUser }) => {
    const [expandedUserId, setExpandedUserId] = React.useState(null);

    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">User Management</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                        <tr className="bg-slate-50">
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Activity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {users.map((userItem) => (
                            <React.Fragment key={userItem.id}>
                                <tr className={`hover:bg-slate-50 transition-colors duration-150 ${expandedUserId === userItem.id ? 'bg-slate-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => toggleExpand(userItem.id)}>
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                                                {userItem.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-slate-900">{userItem.name}</div>
                                                {userItem.bookings?.length > 0 && (
                                                    <div className="text-xs text-indigo-600 mt-0.5 font-medium">Click to view history</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-600">{userItem.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-600">
                                            <span className="font-medium text-slate-900">{userItem.total_bookings || 0}</span> bookings
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {userItem.is_admin ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {userItem.id !== currentUser?.id && (
                                            <button
                                                onClick={() => onDeleteUser(userItem.id, userItem.name)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                title="Delete User"
                                            >
                                                <DeleteIcon className="w-5 h-5 opacity-75 group-hover:opacity-100" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {expandedUserId === userItem.id && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                                            <div className="text-sm">
                                                <h4 className="font-bold text-slate-900 mb-3">Booking History</h4>
                                                {userItem.bookings && userItem.bookings.length > 0 ? (
                                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                                        <table className="min-w-full divide-y divide-slate-200">
                                                            <thead className="bg-white">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Expert</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Feedback</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-slate-200">
                                                                {userItem.bookings.map((booking) => (
                                                                    <tr key={booking.id}>
                                                                        <td className="px-4 py-2 text-slate-900">{booking.expert?.name || 'Unknown'}</td>
                                                                        <td className="px-4 py-2 text-slate-600">{new Date(booking.slot_start).toLocaleDateString()}</td>
                                                                        <td className="px-4 py-2 text-slate-600">
                                                                            {booking.payment ? `₹${booking.payment.amount}` : '-'}
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                                                                                ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                                                        'bg-slate-100 text-slate-800'}`}>
                                                                                {booking.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            {booking.has_feedback ? (
                                                                                <div className="flex flex-col">
                                                                                    <div className="flex items-center gap-1">
                                                                                        <span className="text-yellow-500 text-xs">⭐</span>
                                                                                        <span className="font-medium text-slate-900">{booking.feedback?.rating}</span>
                                                                                    </div>
                                                                                    {booking.feedback?.comment && (
                                                                                        <span className="text-xs text-slate-500 italic truncate max-w-[200px] block" title={booking.feedback.comment}>
                                                                                            "{booking.feedback.comment}"
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-slate-400 text-xs italic">No feedback</span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 italic">No bookings found for this user.</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
