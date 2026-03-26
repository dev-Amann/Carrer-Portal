import React from 'react';
import Button from '../ui/Button';

const BookingSummary = ({ expert, date, time, duration, onConfirm, onBack, loading }) => {

    const calculateTotal = () => {
        return expert.rate_per_hour * duration;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl"></div>

                <div className="relative space-y-4">
                    <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                        <div>
                            <p className="text-sm text-slate-500">Expert</p>
                            <h4 className="text-xl font-bold text-slate-900 mt-1">{expert.name}</h4>
                            <p className="text-sm text-indigo-600 mt-0.5">{expert.title || 'Career Consultant'}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                            {/* Avatar placeholder or image if available */}
                            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-500">
                                {expert.name ? expert.name.charAt(0) : 'E'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date</p>
                            <p className="text-slate-900 font-medium">{formatDate(date)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Time</p>
                            <p className="text-slate-900 font-medium">{formatTime(time)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-slate-900 font-medium">{duration} Hour{duration > 1 ? 's' : ''}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                            <p className="text-emerald-600 font-bold text-lg">₹{calculateTotal()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                    Back
                </Button>
                <Button
                    onClick={onConfirm}
                    loading={loading}
                    variant="primary"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                    Confirm Booking
                </Button>
            </div>
        </div>
    );
};

export default BookingSummary;
