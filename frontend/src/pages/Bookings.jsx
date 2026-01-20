import React, { useState, useEffect } from 'react';
// Force rebuild
import { API } from '../lib/api';
import JitsiEmbed from '../components/JitsiEmbed';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (activeRoom) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] py-4 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto h-[full]">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Video Consultation</h1>
            <Button
              onClick={handleLeaveCall}
              variant="danger"
            >
              Leave Call
            </Button>
          </div>
          <div className="glass-card p-4 h-[calc(100vh-100px)]">
            <JitsiEmbed roomId={activeRoom} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title="My Bookings" description="Manage your expert consultation sessions." />
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.05, pointerEvents: 'none' }}></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-400">
            View and manage your expert consultation bookings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="glass-card rounded-lg p-12 text-center animate-fade-in">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
            <h3 className="text-xl font-semibold text-white mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-400 mb-6">
              Book a consultation with an expert to get started
            </p>
            <Button
              onClick={() => window.location.href = '/services'}
              variant="gradient"
            >
              Browse Experts
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="glass-card rounded-lg p-6 hover:border-indigo-500/30 transition-all animate-fade-in-up"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-white">
                        {booking.expert?.name || 'Expert Consultation'}
                      </h3>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </div>

                    {booking.expert?.bio && (
                      <p className="text-gray-400 mb-3 line-clamp-2">
                        {booking.expert.bio}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-300">
                        <svg
                          className="h-5 w-5 mr-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium">Start:</span>
                        <span className="ml-2">{formatDateTime(booking.slot_start)}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <svg
                          className="h-5 w-5 mr-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">End:</span>
                        <span className="ml-2">{formatDateTime(booking.slot_end)}</span>
                      </div>
                      {booking.expert?.rate_per_hour && (
                        <div className="flex items-center text-gray-300">
                          <svg
                            className="h-5 w-5 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">Rate:</span>
                          <span className="ml-2">₹{booking.expert.rate_per_hour}/hour</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {booking.status === 'confirmed' && booking.jitsi_room && (
                      <Button
                        onClick={() => handleJoinCall(booking)}
                        variant="gradient"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Join Video Call
                      </Button>
                    )}
                    {booking.status === 'pending' && (
                      <div className="text-center text-sm text-gray-400">
                        Waiting for confirmation
                      </div>
                    )}
                    {booking.status === 'completed' && (
                      <div className="text-center text-sm text-gray-400">
                        Session completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
