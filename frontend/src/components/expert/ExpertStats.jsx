import { motion } from 'framer-motion';

const ExpertStats = ({ earnings }) => {
    if (!earnings) return null;

    const statConfig = {
        indigo: { bg: "bg-indigo-500/10", hover: "group-hover:bg-indigo-500/20" },
        yellow: { bg: "bg-yellow-500/10", hover: "group-hover:bg-yellow-500/20" },
        emerald: { bg: "bg-emerald-500/10", hover: "group-hover:bg-emerald-500/20" },
        blue: { bg: "bg-blue-500/10", hover: "group-hover:bg-blue-500/20" }
    };

    const stats = [
        { label: "Total Earnings", value: `₹${earnings.total_earnings.toLocaleString()}`, color: "indigo" },
        { label: "Pending Earnings", value: `₹${earnings.pending_earnings.toLocaleString()}`, color: "yellow" },
        { label: "Total Bookings", value: earnings.total_bookings, color: "emerald" },
        { label: "Upcoming Bookings", value: earnings.upcoming_bookings, color: "blue" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 ${statConfig[stat.color].bg} rounded-full blur-2xl ${statConfig[stat.color].hover} transition-all duration-500`}></div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</h3>
                        <p className="mt-2 text-3xl font-bold text-white tracking-tight">
                            {stat.value}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ExpertStats;
