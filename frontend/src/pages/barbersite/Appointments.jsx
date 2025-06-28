import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import BarberSidebar from '../../components/barbercompo/BarberSidebar';
import { MessageCircle, MapPin } from 'lucide-react';

function Appointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingBookingId, setTrackingBookingId] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('barbersite/barber-appointments/');
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Fetch appointments failed:', err);
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChatClick = (appointment) => {
    if (!appointment.id) return alert('Invalid booking ID');
    navigate(`/barber/chat/${appointment.id}`, {
      state: {
        appointmentData: appointment,
        customerName: appointment.customer_name
      }
    });
  };

  const handleViewMap = (appointment) => {
    if (!appointment.address) return alert("No address for this booking.");
    const query = encodeURIComponent(appointment.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleStartTravel = async (appointment) => {
    const bookingId = appointment.id;
    try {
      await apiClient.post('/barbersite/start-travel/', {
        booking_id: bookingId
      });
      setTrackingBookingId(bookingId);
    } catch (err) {
      console.error('Start travel failed:', err);
      alert('Failed to start travel');
    }
  };

  const handleStopTravel = async () => {
    try {
      await apiClient.post('/barbersite/stop-travel/');
      setTrackingBookingId(null);
    } catch (err) {
      console.error('Stop travel failed:', err);
      alert('Failed to stop travel');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-[#0f172a] text-white"><BarberSidebar /></div>
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-[#0f172a] text-white"><BarberSidebar /></div>
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-[#0f172a] text-white"><BarberSidebar /></div>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>

        {data.length === 0 ? (
          <p className="text-gray-600 text-center">No appointments yet.</p>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.id || index} className="border border-gray-200 p-6 rounded-lg shadow bg-white relative">
                {/* Chat Button */}
                {item.status !== 'COMPLETED' && (
                  <div
                    className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
                    onClick={() => handleChatClick(item)}
                    title="Open chat with customer"
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">Chat</span>
                  </div>
                )}

                {/* Map Button */}
                <div className="absolute top-4 right-28">
                  <button
                    className="text-green-600 hover:text-green-800 cursor-pointer flex items-center gap-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg"
                    onClick={() => handleViewMap(item)}
                    title="View customer location"
                  >
                    <MapPin size={18} />
                    <span className="text-sm font-medium">Map</span>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800'
                      : item.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Appointment Info */}
                <div className="space-y-2">
                  <p><strong>Booking ID:</strong> #{item.id}</p>
                  <p><strong>Customer Name:</strong> {item.customer_name}</p>
                  <p><strong>Service:</strong> {item.service}</p>
                  <p><strong>Slot:</strong> {item.date} | {item.time}</p>
                  <p><strong>Address:</strong> {item.address}</p>
                  <p><strong>Phone:</strong> {item.phone}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                </div>

                {/* Travel Controls */}
                {item.status === 'CONFIRMED' && (
                  trackingBookingId === item.id ? (
                    <button
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                      onClick={handleStopTravel}
                    >
                      Stop Travel
                    </button>
                  ) : (
                    <button
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={() => handleStartTravel(item)}
                    >
                      Start Travel
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
