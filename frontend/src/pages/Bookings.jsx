import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';

// Components
import EmptyBookings from '../components/booking/EmptyBookings';
import FeedbackModal from '../components/feedback/FeedbackModal'; // Import FeedbackModal

import BookingsList from '../components/booking/BookingsList';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State for feedback modal
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.bookings.getUserBookings();
      setBookings(response.data.bookings || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleJoinCall = (booking) => {
    if (booking.jitsi_room) {
      navigate(`/meeting/${booking.jitsi_room}`);
    } else {
      showToast('No video room available for this booking', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="My Bookings" description="Manage your expert consultation sessions." />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              My Consultations
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your upcoming sessions and history
            </p>
          </div>
          <div className="flex gap-2">
            {/* Potential filters can go here */}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-center">
            <p className="text-rose-600 text-sm font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-slate-500">Loading schedule...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyBookings onBrowseExperts={() => window.location.href = '/experts'} />
        ) : (
          <BookingsList
            bookings={bookings}
            onJoinCall={handleJoinCall}
            onLeaveFeedback={(booking) => setSelectedBookingForFeedback(booking)}
          />
        )}

        {/* Feedback Modal */}
        {selectedBookingForFeedback && (
          <FeedbackModal
            booking={selectedBookingForFeedback}
            onClose={() => setSelectedBookingForFeedback(null)}
            onSuccess={() => {
              showToast('Feedback submitted successfully!');
              // Optionally refresh bookings to update UI if we were showing "Rated" status
              // For now, strictly closing is enough, but refreshing ensures data consistency if we add "See Feedback" button later
              fetchBookings();
            }}
          />
        )}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default Bookings;
