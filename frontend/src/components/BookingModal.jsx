import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import Toast from './Toast';

const BookingModal = ({ expert, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Confirm, 3: Payment
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1); // hours
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      setLoading(true);
      // Generate time slots from 9 AM to 6 PM
      const slots = [];
      for (let hour = 9; hour <= 18; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 18) {
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
      setAvailableSlots(slots);
    } catch (error) {
      showToast('Failed to load available slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return maxDate.toISOString().split('T')[0];
  };

  const calculateTotal = () => {
    return expert.rate_per_hour * duration;
  };

  const handleDateTimeSubmit = () => {
    if (!selectedDate || !selectedTime) {
      showToast('Please select both date and time', 'error');
      return;
    }
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      // Create booking
      const slotStart = new Date(`${selectedDate}T${selectedTime}`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60 * 60 * 1000);

      const response = await api.post('/bookings/create', {
        expert_id: expert.id,
        slot_start: slotStart.toISOString(),
        slot_end: slotEnd.toISOString()
      });

      if (response.data.success) {
        setBookingData(response.data.booking);
        setStep(3);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create payment order
      const response = await api.post('/payments/create-order', {
        booking_id: bookingData.id,
        amount: calculateTotal()
      });

      if (response.data.success) {
        const { order_id, amount, currency, key_id } = response.data;

        // Options for Razorpay
        const options = {
          key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
          amount: amount,
          currency: currency,
          name: 'Career Portal',
          description: `Consultation with ${expert.name}`,
          order_id: order_id,
          handler: async function (response) {
            try {
              // Verify payment
              const verifyResponse = await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.data.success) {
                showToast('Payment successful! Booking confirmed.', 'success');
                setTimeout(() => {
                  onSuccess && onSuccess();
                  onClose();
                }, 2000);
              } else {
                showToast('Payment verification failed', 'error');
              }
            } catch (error) {
              console.error(error);
              showToast('Payment verification failed', 'error');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '' // Assuming user has phone, if not it's optional
          },
          theme: {
            color: '#3B82F6'
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', function (response) {
          showToast(response.error.description || 'Payment failed', 'error');
          setLoading(false);
        });

      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to process payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Book Consultation
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              with {expert.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-900/50">
          <div className="flex items-center justify-between">
            {['Select Time', 'Confirm', 'Payment'].map((label, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step > index + 1 ? 'bg-green-500 text-white' :
                  step === index + 1 ? 'bg-blue-500 text-white' :
                    'bg-gray-300 dark:bg-gray-600 text-gray-400'
                  }`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= index + 1 ? 'text-white' : 'text-gray-400'
                  }`}>
                  {label}
                </span>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setDuration(hours)}
                      className={`p-3 rounded-lg border-2 transition-colors ${duration === hours
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-600 hover:border-blue-300'
                        }`}
                    >
                      <div className="font-semibold text-white">{hours} Hour{hours > 1 ? 's' : ''}</div>
                      <div className="text-sm text-gray-400">₹{expert.rate_per_hour * hours}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Time Slot
                  </label>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-2 rounded-lg border transition-colors text-sm ${selectedTime === slot
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-gray-600 hover:border-blue-300 text-gray-300'
                            }`}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleDateTimeSubmit}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Confirmation
              </button>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Expert:</span>
                  <span className="font-semibold text-white">{expert.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-semibold text-white">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-semibold text-white">{formatTime(selectedTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-semibold text-white">{duration} Hour{duration > 1 ? 's' : ''}</span>
                </div>
                <div className="border-t border-gray-600 pt-3 flex justify-between">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-blue-400">₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Booking Created Successfully!
                </h3>
                <p className="text-gray-400">
                  Complete the payment to confirm your consultation
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount to Pay:</span>
                  <span className="text-2xl font-bold text-white">₹{calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <p className="text-xs text-center text-gray-400">
                Secure payment powered by Razorpay
              </p>
            </div>
          )}
        </div>
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

export default BookingModal;
