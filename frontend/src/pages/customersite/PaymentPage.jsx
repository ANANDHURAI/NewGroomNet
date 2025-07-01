import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import { ConfirmationModal } from '../../components/admincompo/serviceCom/ConfirmationModal';
import Navbar from '../../components/basics/Navbar';
import { loadStripe } from '@stripe/stripe-js';

function PaymentPage() {
  const [method, setMethod] = useState("COD");
  const [bookingType , SetBookingType] = useState('')
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    selectedServiceId: null,
    selectedBarberId: null,
    selectedSlotId: null,
    selectedAddressId: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service_id');
    const barberId = urlParams.get('barber_id');
    const slotId = urlParams.get('slot_id');
    const addressId = urlParams.get('address_id');

    if (!serviceId || !barberId || !slotId || !addressId) {
      setError('Missing booking information. Please start from the beginning.');
      return;
    }

    setBookingData({
      selectedServiceId: parseInt(serviceId),
      selectedBarberId: parseInt(barberId),
      selectedSlotId: parseInt(slotId),
      selectedAddressId: parseInt(addressId)
    });
  }, []);

  const handlePaymentMethod = async () => {
    setLoading(true);
    setError(null);

    if (!bookingData.selectedServiceId || !bookingData.selectedBarberId || !bookingData.selectedSlotId || !bookingData.selectedAddressId) {
      setError("Missing required booking information. Please go back and complete all steps.");
      setLoading(false);
      setConfirming(false);
      return;
    }

    try {
      const bookingRes = await apiClient.post('/customersite/create-booking/', {
        service: bookingData.selectedServiceId,
        barber: bookingData.selectedBarberId,
        slot: bookingData.selectedSlotId,
        address: bookingData.selectedAddressId,
        payment_method: method,
        booking_type:bookingType
      });

      const bookingId = bookingRes.data.booking_id;

      if (method === "COD") {
        navigate('/booking-success');
        return;
      }

      if (method === "Wallet") {
        navigate('/booking-success');
        return;
      }

      const stripeSessionRes = await apiClient.post('/paymentservice/create-checkout-session/', {
        booking_id: bookingId
      });

      const { sessionId, stripe_public_key } = stripeSessionRes.data;

      const stripe = await loadStripe(stripe_public_key);
      await stripe.redirectToCheckout({ sessionId });

    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Something went wrong while booking.");
      }
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  const hasAllData = bookingData.selectedServiceId && bookingData.selectedBarberId &&
    bookingData.selectedSlotId && bookingData.selectedAddressId;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Navbar />
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Payment Method</h2>

      <div className="mb-6">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="STRIPE">Stripe (pay with card)</option>
          <option value="WALLET">Wallet</option>
        </select>
      </div>
      <h2>Select your booking type</h2>
      <div className="mb-6">
        <select
          value={bookingType}
          onChange={(e) => SetBookingType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="INSTANT_BOOKING">Instant Booking</option>
          <option value="SCHEDULE_BOOKING">Schedule Booking</option>
        </select>
      </div>

      <button
        onClick={() => setConfirming(true)}
        disabled={loading || !hasAllData}
        className={`w-full py-3 px-4 rounded-md font-semibold ${
          !loading && hasAllData
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>

      <ConfirmationModal
        isOpen={confirming}
        onClose={() => !loading && setConfirming(false)}
        onConfirm={handlePaymentMethod}
        title="Confirm Booking"
        message={`Are you sure you want to book with ${method} payment method?`}
        confirmText={loading ? "Processing..." : "Confirm"}
        cancelText="Cancel"
        confirmColor="bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      />

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default PaymentPage;
