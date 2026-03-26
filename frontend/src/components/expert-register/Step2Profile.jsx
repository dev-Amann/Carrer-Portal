import React from 'react';
import Button from '../ui/Button';

const Step2Profile = ({
    formData,
    handleChange,
    onSubmit,
    onBack,
    loading
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">

                    {/* Specialization & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="specialization" className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                            <input
                                type="text" id="specialization" name="specialization" required
                                value={formData.specialization} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="e.g. Web Development"
                            />
                        </div>
                        <div>
                            <label htmlFor="experience_years" className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                            <input
                                type="number" id="experience_years" name="experience_years" required min="0"
                                value={formData.experience_years} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="5"
                            />
                        </div>
                    </div>

                    {/* Rate & LinkedIn */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="rate_per_hour" className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (₹)</label>
                            <input
                                type="number" id="rate_per_hour" name="rate_per_hour" required min="1"
                                value={formData.rate_per_hour} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="2000"
                            />
                        </div>
                        <div>
                            <label htmlFor="linkedin_url" className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                            <input
                                type="url" id="linkedin_url" name="linkedin_url"
                                value={formData.linkedin_url} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>

                    {/* GitHub & Portfolio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="github_url" className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
                            <input
                                type="url" id="github_url" name="github_url"
                                value={formData.github_url} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div>
                            <label htmlFor="portfolio_url" className="block text-sm font-medium text-slate-700 mb-1">Portfolio URL</label>
                            <input
                                type="url" id="portfolio_url" name="portfolio_url"
                                value={formData.portfolio_url} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="https://portfolio.com"
                            />
                        </div>
                    </div>

                    {/* Resume URL */}
                    <div>
                        <label htmlFor="resume_url" className="block text-sm font-medium text-slate-700 mb-1">Resume URL <span className="text-red-500">*</span></label>
                        <input
                            type="url" id="resume_url" name="resume_url" required
                            value={formData.resume_url} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="https://drive.google.com/file/..."
                        />
                        <p className="mt-1 text-xs text-slate-500">Please provide a direct link to your resume (Google Drive, Dropbox, etc.)</p>
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Professional Bio</label>
                        <textarea
                            id="bio" name="bio" rows="4" required
                            value={formData.bio} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Tell us about your professional journey..."
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                        disabled={loading}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-sm font-semibold"
                    >
                        Submit Application
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default Step2Profile;
