import React from 'react';
import Button from '../ui/Button';
import { CheckIcon, XIcon } from './AdminIcons';

const PendingExperts = ({ experts, onApprove, onReject }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Pending Approvals</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                    {experts.length} Pending
                </span>
            </div>

            <div className="divide-y divide-slate-200">
                {experts.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <CheckIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-900">All caught up</h3>
                        <p className="text-sm text-slate-500 mt-1">No pending expert approvals at the moment.</p>
                    </div>
                ) : (
                    experts.map((expert) => (
                        <div key={expert.id} className="p-6 hover:bg-slate-50 transition-colors duration-150">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Expert Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-bold text-slate-900">{expert.user?.name}</h4>
                                            <span className="text-sm px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 font-medium">
                                                {expert.specialization}
                                            </span>
                                        </div>
                                        <span className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                            {expert.user?.email}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-4xl">
                                        {expert.bio}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Experience</p>
                                            <p className="font-medium text-slate-900">{expert.years_of_experience} years</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Rate</p>
                                            <p className="font-medium text-slate-900">₹{expert.rate_per_hour}/hr</p>
                                        </div>
                                    </div>

                                    {/* Documents & Links */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {expert.resume_url && (
                                            <a href={expert.resume_url} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                Resume
                                            </a>
                                        )}
                                        {expert.linkedin_url && (
                                            <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
                                                LinkedIn
                                            </a>
                                        )}
                                        {expert.github_url && (
                                            <a href={expert.github_url} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors">
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[140px] justify-center">
                                    <Button
                                        onClick={() => onApprove(expert.id)}
                                        className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                    >
                                        <CheckIcon className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => onReject(expert.id)}
                                        className="w-full justify-center bg-white text-red-600 border border-red-200 hover:bg-red-50"
                                    >
                                        <XIcon className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PendingExperts;
