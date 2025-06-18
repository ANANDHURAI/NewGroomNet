import React, { useEffect, useState } from 'react';
import apiClient from '../../slices/api/apiIntercepters';
import Navbar from '../../components/basics/Navbar';

function SuccessPage() {
  const [data, setData] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const response = await apiClient.get('/customersite/booking-success/');
      const booking = response.data;
      setData(booking);
      calculateTimeLeft(booking.date, booking.start_time);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to load booking details');
      setLoading(false);
    }
  };

  const calculateTimeLeft = (date, startTime) => {
    const bookingTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    const diff = bookingTime - now;

    if (diff <= 0) {
      setTimeLeft("Your service currently active.");
      return;
    }

    const diffInMinutes = Math.floor(diff / 60000);
    const days = Math.floor(diffInMinutes / (60 * 24));
    const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
    const minutes = diffInMinutes % 60;

    let result = '';
    if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
    if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;
    result += `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;

    setTimeLeft(result);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <>
    <Navbar/>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your appointment has been successfully booked</p>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Booking Details</h3>
              <p><span className="font-medium">Order ID:</span> #{data.orderid}</p>
              <p><span className="font-medium">Service:</span> {data.service}</p>
              <p><span className="font-medium">Status:</span> 
                <span className="ml-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  {data.booking_status}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Customer Info</h3>
              <p><span className="font-medium">Name:</span> {data.name}</p>
              <p><span className="font-medium">Barber:</span> {data.barbername}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Appointment Time</h3>
              <p><span className="font-medium">Date:</span> {data.date}</p>
              <p><span className="font-medium">Time:</span> {data.slottime}</p>
              <p className="text-sm text-blue-600 font-medium mt-2">{timeLeft}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Payment Info</h3>
              <p><span className="font-medium">Method:</span> {data.payment_method}</p>
              <p><span className="font-medium">Amount:</span> ₹{data.total_amount}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Service Address</h3>
            <p>{data.address}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-800 mb-2">Important Notes</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Please be available at the scheduled time</li>
            </ul>
          </div>
        </div>
      )}
    </div>
    </>

  );
}

export default SuccessPage;