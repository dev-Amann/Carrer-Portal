import { motion, AnimatePresence } from 'framer-motion';
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

    // Filter skills logic (moved from parent or passed down, here we assume filtered skills are derived from props if not passed directly)
    // To keep it simple, we'll implement the filtering logic here as it's UI concern
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6"
        >
            {/* Search Bar */}
            <div className="mb-6 relative">
                <Input
                    type="text"
                    placeholder="Search skills (e.g., Python, Project Management)..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 bg-gray-900/50 border-gray-700 focus:border-indigo-500 transition-all duration-300"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </span>
            </div>

            {/* Selected Skills Summary */}
            <AnimatePresence>
                {selectedSkills.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-8 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                Selected Skills ({selectedSkills.length})
                            </h3>
                            <button
                                onClick={onClearSkills}
                                className="px-3 py-1 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <AnimatePresence>
                                {selectedSkills.map(skill => (
                                    <motion.div
                                        key={skill.skill_id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-indigo-600/20 text-indigo-200 border border-indigo-500/30 rounded-lg text-sm group hover:border-indigo-400 transition-colors"
                                    >
                                        <span className="font-medium">{skill.name}</span>
                                        <div className="h-4 w-[1px] bg-indigo-500/30 mx-1" />
                                        <select
                                            value={skill.proficiency}
                                            onChange={(e) => onProficiencyChange(skill.skill_id, e.target.value)}
                                            className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer text-indigo-300 font-light py-0 pl-0 pr-6"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="beginner" className="bg-gray-900">Beginner</option>
                                            <option value="intermediate" className="bg-gray-900">Intermediate</option>
                                            <option value="advanced" className="bg-gray-900">Advanced</option>
                                            <option value="expert" className="bg-gray-900">Expert</option>
                                        </select>
                                        <button
                                            onClick={() => onSkillToggle(skill.skill_id, skill.name, skill.category)}
                                            className="ml-1 text-indigo-400 hover:text-white hover:bg-red-500/20 rounded-full p-0.5 transition-all"
                                        >
                                            ×
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skills by Category */}
            <form onSubmit={onSubmit}>
                <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(filteredSkills).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <span className="text-4xl mb-3">😕</span>
                            <p>No skills found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        Object.keys(filteredSkills).map((category, idx) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-800/20 rounded-xl p-5 border border-white/5"
                            >
                                <h3 className="text-lg font-bold text-white mb-4 capitalize flex items-center gap-2">
                                    <span className="text-indigo-400">#</span> {category}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {filteredSkills[category].map(skill => {
                                        const isSelected = selectedSkills.some(s => s.skill_id === skill.id);
                                        return (
                                            <motion.label
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                key={skill.id}
                                                className={`relative flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${isSelected
                                                    ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]'
                                                    : 'bg-gray-800/40 border-transparent hover:bg-gray-700/60 hover:border-gray-600'
                                                    } border`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500'
                                                    }`}>
                                                    {isSelected && <span className="text-white text-xs">✓</span>}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => onSkillToggle(skill.id, skill.name, category)}
                                                    className="hidden"
                                                />
                                                <span className={`ml-3 text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                    {skill.name}
                                                </span>
                                            </motion.label>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end pt-6 border-t border-white/10">
                    <Button
                        type="submit"
                        disabled={loading || selectedSkills.length === 0}
                        isLoading={loading}
                        className="w-full sm:w-auto px-8 py-3 text-lg shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? 'Analyzing Profile...' : 'Get Recommendations →'}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

export default SkillSelection;
