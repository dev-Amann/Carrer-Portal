import React from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { UsersIcon, ApprovedIcon, CheckIcon } from './AdminIcons';

const AdminOverview = ({ stats, bookingsData, expertsData, COLORS }) => {
    if (!stats) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <UsersIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">Total</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Active Users</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.users.total}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <ApprovedIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                            {stats.experts.pending} pending
                        </span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Total Experts</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.experts.total}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <CheckIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            {stats.bookings.completed} completed
                        </span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Total Bookings</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.bookings.total}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">INR</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">₹{stats.revenue.total.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                        Bookings Overview
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={bookingsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {bookingsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 500 }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Expert Applications
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expertsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} dy={10} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.75rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={48} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
