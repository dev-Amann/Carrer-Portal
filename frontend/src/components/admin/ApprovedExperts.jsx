import React from 'react';

const ApprovedExperts = ({ experts }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Approved Experts Directory</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Expert</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {experts.map((expert) => (
                            <tr key={expert.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                            {expert.user?.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-slate-900">{expert.user?.name}</div>
                                            <div className="text-xs text-slate-500">{expert.specialization}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-600">{expert.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">₹{expert.rate_per_hour}/hr</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedExperts;
