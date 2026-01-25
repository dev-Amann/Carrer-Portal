import { motion } from 'framer-motion';
import Button from '../ui/Button';

const GapSkillsList = ({ gaps, onGetGuidance }) => {
    if (!gaps) return null;

    if (gaps.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 text-center"
            >
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You're Fully Qualified!</h3>
                <p className="text-gray-400">You matched all the required skills for this career.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    Skills to Develop <span className="text-base font-normal text-gray-500">({gaps.length})</span>
                </h2>

                {onGetGuidance && (
                    <Button variant="outline" size="sm" onClick={onGetGuidance} className="hidden sm:flex">
                        Find Mentors
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {gaps.map((skill, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.05) }}
                        className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${skill.status === 'missing'
                            ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                            : 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40'
                            }`}
                    >
                        {/* Progress bar background hint */}
                        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-white text-lg">{skill.skill_name}</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${skill.status === 'missing'
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}>
                                        {skill.status === 'missing' ? 'Missing' : 'Improve'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${skill.status === 'missing' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                    {skill.category}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Current</span>
                                    <span className="font-medium text-white capitalize">
                                        {skill.current_level || 'None'}
                                    </span>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Target</span>
                                    <span className="font-bold text-indigo-400 capitalize">
                                        {skill.required_level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {onGetGuidance && (
                <div className="mt-6 sm:hidden">
                    <Button variant="outline" onClick={onGetGuidance} className="w-full justify-center">
                        Find Mentors
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default GapSkillsList;
