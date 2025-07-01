import { useState, useEffect } from "react";
import apiClient from "../../slices/api/apiIntercepters";
import { ArrowLeft, Check, Scissors, User, Calendar, Clock, MapPin, Phone } from 'lucide-react';
import Navbar from "../../components/basics/Navbar";

export const ConfirmBooking = () => {
  const [bookingSummary, setBookingSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentBookingData = {
      service_id: urlParams.get('service_id'),
      barber_id: urlParams.get('barber_id'),
      slot_id: urlParams.get('slot_id'),
      address_id: urlParams.get('address_id')
    };

    if (!currentBookingData.service_id || !currentBookingData.barber_id || !currentBookingData.slot_id || !currentBookingData.address_id) {
      setError('Missing booking information. Please start from the beginning.');
      setLoading(false);
      return;
    }

    setBookingData(currentBookingData);
    fetchBookingSummary(currentBookingData);
  }, []);

  const fetchBookingSummary = async (bookingData) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/customersite/booking-summary/', bookingData);
      console.log('Booking Summary Response:', response.data); // Debug log
      
      // If service_amount and platform_fee are missing, calculate them
      let summary = response.data;
      if (!summary.service_amount && summary.service && summary.service.price) {
        const serviceAmount = parseFloat(summary.service.price);
        const platformFee = Math.round(serviceAmount * 0.05 * 100) / 100; // 5% fee, rounded to 2 decimals
        const totalAmount = Math.round((serviceAmount + platformFee) * 100) / 100;
        
        summary = {
          ...summary,
          service_amount: serviceAmount,
          platform_fee: platformFee,
          total_amount: totalAmount
        };
      }
      
      setBookingSummary(summary);
    } catch (error) {
      console.error('Error fetching booking summary:', error);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleConfirmBooking = async () => {
    try {
      setConfirming(true);

      const paymentUrl = new URL('/payment', window.location.origin);
      paymentUrl.searchParams.set('service_id', bookingData.service_id);
      paymentUrl.searchParams.set('barber_id', bookingData.barber_id);
      paymentUrl.searchParams.set('slot_id', bookingData.slot_id);
      paymentUrl.searchParams.set('address_id', bookingData.address_id);
      
      window.location.href = paymentUrl.toString();
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 text-center max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (!bookingSummary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Confirm Booking</h1>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-lg text-gray-600">Review your appointment details</p>
        </div>

        <div className="bg-white rounded-xl p-6 mb-6 shadow-md space-y-6">
          <div className="flex items-center space-x-4 border-b pb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{bookingSummary.service.name}</h3>
              <p className="text-sm text-gray-600">{bookingSummary.service.duration} minutes</p>
            </div>
            <p className="font-semibold text-green-600 whitespace-nowrap">₹{bookingSummary.service.price}</p>
          </div>

          <div className="flex items-center space-x-4 border-b pb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{bookingSummary.barber.name}</h3>
              <p className="text-sm text-gray-600">Professional Barber</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 border-b pb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{formatDate(bookingSummary.slot.date)}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(bookingSummary.slot.start_time)} - {formatTime(bookingSummary.slot.end_time)}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Service Address</h3>
              <p className="text-sm text-gray-600 mb-2">{bookingSummary.address.full_address}</p>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-1" />
                {bookingSummary.address.mobile}
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown - FIXED */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">Price Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Amount</span>
              <span className="text-gray-800">₹{Number(bookingSummary.service_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Platform Fee (5%)</span>
              <span className="text-gray-800">₹{Number(bookingSummary.platform_fee).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">₹{Number(bookingSummary.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={confirming}
          className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {confirming ? 'Processing...' : 'Confirm & Proceed to Payment'}
        </button>

        <div className="mt-4 bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-blue-800 text-center">
            Payment will be processed securely. Total includes service fee and platform charges.
          </p>
        </div>
      </div>
    </div>
  );
};