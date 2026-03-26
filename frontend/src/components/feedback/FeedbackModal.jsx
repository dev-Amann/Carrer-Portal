
import React, { useState } from 'react';
import { API } from '../../lib/api';
import Button from '../ui/Button';

const FeedbackModal = ({ booking, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await API.feedback.create({
                booking_id: booking.id,
                rating,
                comment
            });

            if (onSuccess) {
                onSuccess();
            }
            onClose();

        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError(err.response?.data?.error || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⭐</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rate your session</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            How was your session with <span className="font-semibold text-slate-900 dark:text-white">{booking.expert?.name || 'the expert'}</span>?
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <svg
                                        className={`w-10 h-10 ${(hoverRating || rating) >= star
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-slate-300 dark:text-slate-600'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        {/* Comment */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Additional Comments (Optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                rows="4"
                                placeholder="Share your experience..."
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Skip
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                isLoading={loading}
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
