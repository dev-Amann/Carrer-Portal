import { motion } from 'framer-motion';

const RequiredSkillsList = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
        >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-blue-400">⚡</span> Required Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (index * 0.05) }}
                        className="flex flex-col p-5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{skill.skill_name}</h3>
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20 capitalize font-medium">
                                {skill.required_level}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></span>
                            {skill.category}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RequiredSkillsList;
