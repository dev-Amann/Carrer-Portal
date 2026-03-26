import { useNavigate } from 'react-router-dom';

const SkillsSummary = ({ userSkills }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Skills</h2>
                <button onClick={() => navigate('/career-recommendation?action=update')} className="text-xs text-slate-400 hover:text-indigo-600 font-medium">
                    Edit
                </button>
            </div>
            {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {userSkills.slice(0, 10).map(skill => (
                        <span key={skill.skill_id} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                            {skill.name}
                        </span>
                    ))}
                    {userSkills.length > 10 && (
                        <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded-md border border-slate-100">
                            +{userSkills.length - 10}
                        </span>
                    )}
                </div>
            ) : (
                <p className="text-sm text-slate-500 italic">No skills added.</p>
            )}
        </div>
    );
};

export default SkillsSummary;
