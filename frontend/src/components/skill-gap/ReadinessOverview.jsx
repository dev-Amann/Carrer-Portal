import { motion } from 'framer-motion';

const ReadinessOverview = ({ readinessPercentage, metSkillsCount, totalRequiredSkills }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-8 text-white backdrop-blur-sm relative overflow-hidden"
        >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        Career Readiness
                        {readinessPercentage >= 80 && <span className="text-2xl">🚀</span>}
                    </h2>
                    <p className="text-lg opacity-90 text-gray-300">
                        You meet <span className="text-white font-bold">{metSkillsCount}</span> out of <span className="text-white font-bold">{totalRequiredSkills}</span> required skills
                    </p>

                    <div className="mt-4 w-full md:w-64 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${readinessPercentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-emerald-400 to-blue-500"
                        />
                    </div>
                </div>

                <div className="text-center bg-white/5 p-4 rounded-xl border border-white/5 min-w-[120px]">
                    <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        {readinessPercentage}%
                    </div>
                    <div className="text-sm font-medium text-emerald-400 mt-1 uppercase tracking-wider">
                        Match Score
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReadinessOverview;
