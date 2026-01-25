import { motion } from 'framer-motion';
import Button from '../ui/Button';
import JitsiEmbed from '../JitsiEmbed';

const VideoConsultation = ({ activeRoom, onLeave }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="min-h-screen bg-[#0a0a0f] py-4 px-4 overflow-hidden fixed inset-0 z-50"
        >
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <h1 className="text-2xl font-bold text-white">Video Consultation</h1>
                    </div>
                    <Button
                        onClick={onLeave}
                        className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
                    >
                        Leave Call
                    </Button>
                </div>
                <div className="glass-card p-1 flex-1 overflow-hidden relative border-indigo-500/20">
                    <JitsiEmbed roomId={activeRoom} />
                </div>
            </div>
        </motion.div>
    );
};

export default VideoConsultation;
