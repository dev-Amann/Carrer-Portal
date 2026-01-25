import { motion } from 'framer-motion';

const MetSkillsList = ({ skills }) => {
    if (!skills || skills.length === 0) {
        return (
            <div className="glass-card p-8 mb-8 text-center opacity-75">
                <p className="text-gray-400">You haven't mastered any of the required skills yet.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 mb-8"
        >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                Skills You Have <span className="text-base font-normal text-gray-500">({skills.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (index * 0.05) }}
                        className="flex items-center justify-between p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-900/20 transition-colors group"
                    >
                        <div>
                            <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">{skill.skill_name}</h3>
                            <p className="text-xs text-gray-400 capitalize mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                                {skill.category}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Level</div>
                            <div className="font-semibold text-green-400 capitalize text-sm bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                                {skill.current_level}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MetSkillsList;
