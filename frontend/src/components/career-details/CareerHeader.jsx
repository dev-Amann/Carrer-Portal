import { motion } from 'framer-motion';

const CareerHeader = ({ title, salaryRange, demandLevel }) => {
    const getDemandBadgeColor = (level) => {
        switch (level) {
            case 'very_high': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'high': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                {title}
            </h1>

            <div className="flex flex-wrap gap-4">
                {/* Salary */}
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <span className="text-xl">💰</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Salary Range</p>
                        <p className="font-semibold text-white">{salaryRange || 'N/A'}</p>
                    </div>
                </div>

                {/* Demand */}
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <span className="text-xl">📈</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Market Demand</p>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${getDemandBadgeColor(demandLevel)}`}>
                                {demandLevel?.replace('_', ' ') || 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CareerHeader;
