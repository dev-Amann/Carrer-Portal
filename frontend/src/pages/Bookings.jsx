import React, { useState, useEffect } from 'react';
import { API } from '../lib/api';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import { AnimatePresence } from 'framer-motion';

// Components
import VideoConsultation from '../components/booking/VideoConsultation';
import EmptyBookings from '../components/booking/EmptyBookings';
import BookingsList from '../components/booking/BookingsList';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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
      setActiveRoom(booking.jitsi_room);
    } else {
      showToast('No video room available for this booking', 'error');
    }
  };

  const handleLeaveCall = () => {
    setActiveRoom(null);
  };

  // Active Video Call View
  if (activeRoom) {
    return (
      <AnimatePresence>
        <VideoConsultation
          activeRoom={activeRoom}
          onLeave={handleLeaveCall}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      <SEO title="My Bookings" description="Manage your expert consultation sessions." />

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.03 }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            My Bookings
          </h1>
          <p className="text-lg text-gray-400">
            View and manage your upcoming expert consultation sessions.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyBookings onBrowseExperts={() => window.location.href = '/experts'} />
        ) : (
          <BookingsList bookings={bookings} onJoinCall={handleJoinCall} />
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

