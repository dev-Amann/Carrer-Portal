import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../lib/api';
import Toast from './Toast';
import Modal from './ui/Modal';
import DateTimeSelection from './booking/DateTimeSelection';
import BookingSummary from './booking/BookingSummary';
import PaymentHandler from './booking/PaymentHandler';

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
      // In a real app, this would fetch from API based on expert's availability
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

  const calculateTotal = () => {
    return expert.rate_per_hour * duration;
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      // Create booking
      const slotStart = new Date(`${selectedDate}T${selectedTime}`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60 * 60 * 1000);

      const response = await API.bookings.create({
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
      const response = await API.payments.createOrder({
        booking_id: bookingData.id,
        amount: calculateTotal()
      });

      if (response.data.success) {
        const { order_id, amount, currency, key_id } = response.data;

        // Verify key (fallback to env if not from backend)
        const razorpayKey = key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;

        if (!razorpayKey) {
          showToast('Payment configuration missing. Please contact support.', 'error');
          setLoading(false);
          return;
        }

        // Options for Razorpay
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: 'Career Portal',
          description: `Consultation with ${expert.name}`,
          order_id: order_id,
          handler: async function (response) {
            try {
              // Verify payment
              const verifyResponse = await API.payments.verify({
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
            contact: user?.phone || ''
          },
          theme: {
            color: '#6366f1' // Indigo-500
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

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Select Date & Time';
      case 2: return 'Confirm Booking';
      case 3: return 'Complete Payment';
      default: return 'Booking';
    }
  };

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={getStepTitle()}
        size="md"
      >
        {step === 1 && (
          <DateTimeSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            duration={duration}
            setDuration={setDuration}
            expert={expert}
            availableSlots={availableSlots}
            loading={loading}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <BookingSummary
            expert={expert}
            date={selectedDate}
            time={selectedTime}
            duration={duration}
            onConfirm={handleConfirmBooking}
            onBack={() => setStep(1)}
            loading={loading}
          />
        )}

        {step === 3 && (
          <PaymentHandler
            amount={calculateTotal()}
            onPay={handlePayment}
            loading={loading}
          />
        )}
      </Modal>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default BookingModal;
