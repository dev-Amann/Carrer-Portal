import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ExpertProfile = ({ profile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        bio: profile?.bio || '',
        rate_per_hour: profile?.rate_per_hour || ''
    });
    const [saving, setSaving] = useState(false);

    // If we wanted to manage 'saving' state in parent, we could pass it down.
    // Assuming onSave returns a promise.

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 max-w-3xl mx-auto relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />

            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>👤</span> Expert Profile
                </h3>
                {!isEditing && (
                    <Button
                        onClick={handleEdit}
                        variant="primary"
                        className="shadow-lg shadow-indigo-500/20"
                    >
                        Edit Profile
                    </Button>
                )}
            </div>

            {!isEditing ? (
                <div className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Name</p>
                            <p className="text-lg text-white font-medium">{profile.name}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Email</p>
                            <p className="text-lg text-white font-medium">{profile.email}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Bio</p>
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {profile.bio || <span className="text-gray-500 italic">No bio added yet.</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Rate per Hour</p>
                            <p className="text-2xl text-white font-bold text-indigo-400">₹{profile.rate_per_hour}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Status</p>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${profile.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                profile.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>

                    {profile.resume_url && (
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Documents</p>
                            <a
                                href={profile.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-all bg-indigo-500/10 px-5 py-3 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/30 group"
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
                        />
                        <p className="mt-2 text-xs text-gray-500 text-right">
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
                            icon={<span className="text-gray-400 font-bold">₹</span>}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Set your hourly consultation rate
                        </p>
                    </div>

                    <div className="flex gap-4 pt-6 mt-8 border-t border-white/10 justify-end">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            disabled={saving}
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
        </motion.div>
    );
};

export default ExpertProfile;
