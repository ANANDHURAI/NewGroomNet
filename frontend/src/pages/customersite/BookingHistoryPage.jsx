import React, { useEffect, useState } from 'react';
import apiClient from '../../slices/api/apiIntercepters';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/customercompo/CustomerLayout';

function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/customersite/booking-history/')
      .then(res => setBookings(res.data))
      .catch(err => console.error("Failed to load booking history", err));
  }, []);

  return (
    <CustomerLayout>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div
              key={booking.id}
              className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{booking.service} with {booking.barbername}</p>
                <p className="text-sm text-gray-600">{booking.date} — {booking.slottime}</p>
                <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                  {booking.booking_status}
                </span>
              </div>
              <button
                onClick={() => navigate(`/booking-details/${booking.id}`)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}

export default BookingHistoryPage;
