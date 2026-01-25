import { motion } from 'framer-motion';
import Button from '../ui/Button';

const EmptyBookings = ({ onBrowseExperts }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-12 text-center max-w-2xl mx-auto relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />

            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
                No bookings yet
            </h3>
            <p className="text-gray-400 mb-8 text-lg">
                Book a consultation with an expert to accelerate your career growth.
            </p>

            <Button
                onClick={onBrowseExperts}
                variant="gradient"
                className="px-8 shadow-lg shadow-indigo-500/20"
            >
                Browse Experts
            </Button>
        </motion.div>
    );
};

export default EmptyBookings;
