import Button from '../ui/Button';

const EmptyBookings = ({ onBrowseExperts }) => {
    return (
        <div className="bg-white rounded-2xl p-12 text-center max-w-lg mx-auto border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                    className="h-10 w-10 text-slate-400"
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

            <h3 className="text-xl font-bold text-slate-900 mb-2">
                No bookings found
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                You haven't booked any consultations yet. Find an expert to get started.
            </p>

            <Button
                onClick={onBrowseExperts}
                variant="primary"
                className="bg-indigo-600 hover:bg-indigo-700"
            >
                Browse Experts
            </Button>
        </div>
    );
};

export default EmptyBookings;
