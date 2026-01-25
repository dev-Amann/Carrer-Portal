import { motion } from 'framer-motion';

const EarningsSummary = ({ earnings }) => {
    if (!earnings) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
        >
            <div className="glass-card p-8 relative overflow-hidden">
                {/* Background decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">💰</span> Earnings Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm text-gray-400 uppercase tracking-wider text-xs">Total Earnings</p>
                        <p className="text-3xl font-bold text-emerald-400 mt-2">
                            ₹{earnings.total_earnings.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm text-gray-400 uppercase tracking-wider text-xs">Pending Earnings</p>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">
                            ₹{earnings.pending_earnings.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm text-gray-400 uppercase tracking-wider text-xs">Completed Transactions</p>
                        <p className="text-3xl font-bold text-blue-400 mt-2">
                            {earnings.completed_transactions}
                        </p>
                    </div>
                    <div className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm text-gray-400 uppercase tracking-wider text-xs">Hourly Rate</p>
                        <p className="text-3xl font-bold text-indigo-400 mt-2">
                            ₹{earnings.rate_per_hour}<span className="text-sm font-normal text-gray-500">/hr</span>
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EarningsSummary;
