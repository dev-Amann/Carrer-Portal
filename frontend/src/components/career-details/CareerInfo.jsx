import { motion } from 'framer-motion';

const CareerInfo = ({ description, roadmap }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8 mb-10"
        >
            <div className="glass-card p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />

                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-indigo-400">📝</span> Role Overview
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                    {description}
                </p>
            </div>

            {roadmap && (
                <div className="glass-card p-8 border-l-4 border-l-purple-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors" />

                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-400">🗺️</span> Learning Roadmap
                    </h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {roadmap}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default CareerInfo;
