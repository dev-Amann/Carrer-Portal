import Button from '../ui/Button';
import Input from '../ui/Input';

const SkillSelection = ({
    skills,
    selectedSkills,
    searchTerm,
    onSearchChange,
    onSkillToggle,
    onProficiencyChange,
    onClearSkills,
    onSubmit,
    loading
}) => {

    const getFilteredSkills = () => {
        if (!searchTerm) return skills;
        const filtered = {};
        Object.keys(skills).forEach(category => {
            const matchingSkills = skills[category].filter(skill =>
                skill.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (matchingSkills.length > 0) {
                filtered[category] = matchingSkills;
            }
        });
        return filtered;
    };

    const filteredSkills = getFilteredSkills();

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {/* Search Bar */}
            <div className="mb-6 relative">
                <Input
                    type="text"
                    placeholder="Search skills (e.g., Python, Project Management)..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 bg-slate-50 border-slate-300 focus:border-indigo-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔍
                </span>
            </div>

            {/* Selected Skills Summary */}
            {selectedSkills.length > 0 && (
                <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            Selected Skills ({selectedSkills.length})
                        </h3>
                        <button
                            onClick={onClearSkills}
                            className="px-3 py-1 text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {selectedSkills.map(skill => (
                            <div
                                key={skill.skill_id}
                                className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white text-indigo-700 border border-indigo-200 rounded-lg text-sm group hover:border-indigo-300 transition-colors shadow-sm"
                            >
                                <span className="font-medium">{skill.name}</span>
                                <div className="h-4 w-[1px] bg-indigo-200 mx-1" />
                                <select
                                    value={skill.proficiency}
                                    onChange={(e) => onProficiencyChange(skill.skill_id, e.target.value)}
                                    className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer text-indigo-600 font-normal py-0 pl-0 pr-6"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                                <button
                                    onClick={() => onSkillToggle(skill.skill_id, skill.name, skill.category)}
                                    className="ml-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-all"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills by Category */}
            <form onSubmit={onSubmit}>
                <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(filteredSkills).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <span className="text-4xl mb-3">😕</span>
                            <p>No skills found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        Object.keys(filteredSkills).map((category) => (
                            <div
                                key={category}
                                className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                            >
                                <h3 className="text-lg font-bold text-slate-800 mb-4 capitalize flex items-center gap-2">
                                    <span className="text-indigo-500">#</span> {category}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {filteredSkills[category].map(skill => {
                                        const isSelected = selectedSkills.some(s => s.skill_id === skill.id);
                                        return (
                                            <label
                                                key={skill.id}
                                                className={`relative flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 border ${isSelected
                                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400'
                                                    }`}>
                                                    {isSelected && <span className="text-white text-xs">✓</span>}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => onSkillToggle(skill.id, skill.name, category)}
                                                    className="hidden"
                                                />
                                                <span className={`ml-3 text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>
                                                    {skill.name}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end pt-6 border-t border-slate-200">
                    <Button
                        type="submit"
                        disabled={loading || selectedSkills.length === 0}
                        isLoading={loading}
                        className="w-full sm:w-auto px-8 py-3 text-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all"
                    >
                        {loading ? 'Analyzing Profile...' : 'Get Recommendations →'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SkillSelection;
