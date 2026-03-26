import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ExpertProfile = ({ profile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        bio: profile?.bio || '',
        rate_per_hour: profile?.rate_per_hour || ''
    });
    const [saving, setSaving] = useState(false);

    const handleEdit = () => {
        setEditForm({
            bio: profile?.bio || '',
            rate_per_hour: profile?.rate_per_hour || ''
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({ bio: '', rate_per_hour: '' });
    };

    const handleSaveClick = async () => {
        setSaving(true);
        try {
            await onSave(editForm);
            setIsEditing(false); // Only close on success
        } catch (e) {
            // Parent handles error toast
        } finally {
            setSaving(false);
        }
    };

    if (!profile) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-3xl mx-auto relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />

            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    Expert Profile
                </h3>
                {!isEditing && (
                    <Button
                        onClick={handleEdit}
                        variant="primary"
                        className="shadow-md"
                    >
                        Edit Profile
                    </Button>
                )}
            </div>

            {!isEditing ? (
                <div className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Name</p>
                            <p className="text-lg text-slate-900 font-medium">{profile.user?.name || profile.name}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Email</p>
                            <p className="text-lg text-slate-900 font-medium">{profile.user?.email || profile.email}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">Bio</p>
                        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {profile.bio || <span className="text-slate-400 italic">No bio added yet.</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Rate per Hour</p>
                            <p className="text-2xl font-bold text-indigo-600">₹{profile.rate_per_hour}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Status</p>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${profile.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                profile.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-red-100 text-red-700 border-red-200'
                                }`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>

                    {profile.resume_url && (
                        <div className="pt-4 border-t border-slate-200">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">Documents</p>
                            <a
                                href={profile.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-all bg-indigo-50 px-5 py-3 rounded-xl border border-indigo-100 hover:bg-indigo-100 group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Resume
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6 relative z-10">
                    <div>
                        <Input
                            label="Bio"
                            as="textarea"
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            rows={6}
                            maxLength={1000}
                            placeholder="Tell clients about your expertise and experience..."
                            className="text-slate-900 bg-white border-slate-300 focus:border-indigo-500"
                        />
                        <p className="mt-2 text-xs text-slate-500 text-right">
                            {editForm.bio.length}/1000 characters
                        </p>
                    </div>

                    <div>
                        <Input
                            label="Hourly Rate"
                            type="number"
                            value={editForm.rate_per_hour}
                            onChange={(e) => setEditForm({ ...editForm, rate_per_hour: e.target.value })}
                            min="0"
                            max="100000"
                            step="50"
                            placeholder="1500"
                            icon={<span className="text-slate-400 font-bold">₹</span>}
                            className="text-slate-900 bg-white border-slate-300 focus:border-indigo-500"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            Set your hourly consultation rate
                        </p>
                    </div>

                    <div className="flex gap-4 pt-6 mt-8 border-t border-slate-200 justify-end">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            disabled={saving}
                            className="text-slate-700 border-slate-300 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveClick}
                            isLoading={saving}
                            disabled={saving}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpertProfile;
