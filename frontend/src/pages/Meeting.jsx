import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import JitsiEmbed from '../components/JitsiEmbed';

const Meeting = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();


    // In a real app, we should fetch booking details by roomId or have it passed in state
    // For now, we'll try to find the booking from the state if passed, or just navigate back
    // Since we don't have the booking ID easily here without fetching, we might need to fetch it
    // But for simplicity in this iteration, we will assume we can't show feedback directly on leave 
    // UNLESS we fetch the booking first.
    // However, to make it work smoothly:
    // 1. Fetch booking by jitsi_room (need new endpoint or just use logic)
    // 2. OR just navigate to bookings page and let user click "Feedback" there.

    // Better UX: Show a "Leave & Review" button?
    // Let's stick to the plan: "Show modal on 'Leave'. On submit/close, navigate back."
    // BUT we need booking_id. 
    // Let's fetch booking by room_id inside Meeting component? OR just navigate to bookings.

    // REVISED PLAN FOR MEETING PAGE:
    // Just navigate back. The BookingsList will have the "Leave Feedback" button.
    // This is safer because we need the booking object.

    const handleLeave = () => {
        // Go back to the previous page
        navigate('/bookings');
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-slate-900">
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full h-full p-4">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                            Video Consultation
                        </h1>
                    </div>
                    <Button
                        onClick={handleLeave}
                        className="bg-white dark:bg-slate-800 text-red-600 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 shadow-sm transition-all duration-200"
                    >
                        Leave Call
                    </Button>
                </div>

                {/* Video Area */}
                <div className="flex-1 bg-white dark:bg-slate-800 p-1 overflow-hidden relative border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl">
                    <JitsiEmbed roomId={roomId} />
                </div>
            </div>
        </div>
    );
};

export default Meeting;
