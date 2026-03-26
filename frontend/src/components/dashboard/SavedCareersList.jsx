import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const SavedCareersList = ({ savedCareers, onUnsaveCareer }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Bookmarked Careers</h2>
                {savedCareers.length > 0 && (
                    <button onClick={() => navigate('/career-recommendation')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View All
                    </button>
                )}
            </div>

            {savedCareers.length > 0 ? (
                <div className="space-y-4">
                    {savedCareers.map(career => (
                        <div key={career.id} className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{career.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-1 mt-1">{career.description}</p>
                                </div>
                                <button
                                    onClick={() => onUnsaveCareer(career.id)}
                                    className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                    title="Remove"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                                        {career.salary_range || 'N/A'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/skill-gap/${career.id}`)}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    View Gap Analysis →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm mb-3">No careers saved yet.</p>
                    <Button onClick={() => navigate('/career-recommendation')} variant="outline" size="sm">
                        Explore Careers
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SavedCareersList;
