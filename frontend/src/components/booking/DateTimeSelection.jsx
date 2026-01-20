import React from 'react';
import Button from '../ui/Button';

const DateTimeSelection = ({
    selectedDate,
    itemDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    duration,
    setDuration,
    expert,
    availableSlots,
    loading,
    onNext
}) => {

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        return maxDate.toISOString().split('T')[0];
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Duration Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Duration
                </label>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((hours) => (
                        <button
                            key={hours}
                            onClick={() => setDuration(hours)}
                            className={`
                relative p-4 rounded-xl border transition-all duration-200 text-left group
                ${duration === hours
                                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                }
              `}
                        >
                            <div className={`font-semibold text-lg mb-1 ${duration === hours ? 'text-indigo-400' : 'text-gray-200'}`}>
                                {hours} Hour{hours > 1 ? 's' : ''}
                            </div>
                            <div className="text-sm text-gray-400 group-hover:text-gray-300">
                                ₹{expert.rate_per_hour * hours}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Date
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder-gray-500 transition-all"
                />
            </div>

            {/* Time Selection */}
            <div className={`space-y-3 transition-all duration-300 ${selectedDate ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 pointer-events-none blur-[2px]'}`}>
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Available Slots
                </label>

                {loading ? (
                    <div className="flex items-center justify-center p-8 bg-white/5 rounded-xl border border-white/5">
                        <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {availableSlots.length > 0 ? availableSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={`
                  px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                  ${selectedTime === slot
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20 scale-105'
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }
                `}
                            >
                                {formatTime(slot)}
                            </button>
                        )) : (
                            <div className="col-span-full text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                No slots available for this date.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-4">
                <Button
                    onClick={onNext}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full h-12 text-lg"
                    variant="primary"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default DateTimeSelection;
