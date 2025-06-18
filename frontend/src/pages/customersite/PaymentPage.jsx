import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import { ConfirmationModal } from '../../components/admincompo/serviceCom/ConfirmationModal';
import Navbar from '../../components/basics/Navbar';

function PaymentPage() {
  const [method, setMethod] = useState("COD");
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
    // Get booking data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service_id');
    const barberId = urlParams.get('barber_id');
    const slotId = urlParams.get('slot_id');
    const addressId = urlParams.get('address_id');

    console.log('URL Parameters:', { serviceId, barberId, slotId, addressId });

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

  // Debug function to log all data
  const debugData = () => {
    console.log('PaymentPage Booking Data:', bookingData);
  };

  const handlePaymentMethod = async () => {
    setLoading(true);
    setError(null);

    // Debug logging
    console.log('Attempting to create booking with data:', {
      service: bookingData.selectedServiceId,
      barber: bookingData.selectedBarberId,
      slot: bookingData.selectedSlotId,
      address: bookingData.selectedAddressId,
      payment_method: method
    });

    // Validate all required fields
    if (!bookingData.selectedServiceId || !bookingData.selectedBarberId || !bookingData.selectedSlotId || !bookingData.selectedAddressId) {
      setError("Missing required booking information. Please go back and complete all steps.");
      setLoading(false);
      setConfirming(false);
      return;
    }

    try {
      const response = await apiClient.post('/customersite/create-booking/', {
        service: bookingData.selectedServiceId,
        barber: bookingData.selectedBarberId,
        slot: bookingData.selectedSlotId,
        address: bookingData.selectedAddressId,
        payment_method: method
      });

      console.log('Booking success response:', response.data);
      navigate('/booking-success');
      
    } catch (error) {
      console.error('Booking error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          // Handle validation errors
          const errorMessages = [];
          for (const [field, messages] of Object.entries(errorData.errors)) {
            errorMessages.push(`${field}: ${messages.join(', ')}`);
          }
          setError(`Validation errors: ${errorMessages.join('; ')}`);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError("Invalid request data. Please check all fields.");
        }
      } else if (error.response?.status === 401) {
        setError("Authentication required. Please log in again.");
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to create booking. Please try again.");
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
      <Navbar/>
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Payment Method</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="COD">Cash on Delivery (COD)</option>
          <option value="UPI" disabled>UPI (Coming Soon)</option>
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

      {!hasAllData && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <strong>Warning:</strong> Missing booking information. Please go back and complete all steps.
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

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
    </div>
  );
}

export default PaymentPage;