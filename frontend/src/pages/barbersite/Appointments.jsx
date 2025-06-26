import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import BarberSidebar from '../../components/barbercompo/BarberSidebar';
import { MessageCircle, MapPin } from 'lucide-react';

function Appointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('barbersite/barber-appointments/');
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleChatClick = (appointment) => {
    if (!appointment.id) {
      console.error('No booking ID found for appointment:', appointment);
      alert('Unable to open chat. Invalid booking ID.');
      return;
    }

    console.log('Opening chat for booking ID:', appointment.id);
    navigate(`/barber/chat/${appointment.id}`, {
      state: { 
        appointmentData: appointment,
        customerName: appointment.customer_name 
      }
    });
  };

  const handleViewMap = (appointment) => {
    if (!appointment.address) {
      alert("No address provided for this appointment.");
      return;
    }

    const query = encodeURIComponent(appointment.address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-[#0f172a] text-white">
          <BarberSidebar />
        </div>
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-gray-500">Loading appointments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-[#0f172a] text-white">
          <BarberSidebar />
        </div>
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-2">Error</div>
            <div className="text-gray-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-[#0f172a] text-white">
        <BarberSidebar />
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>

        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">No appointments found.</p>
            <p className="text-gray-500 text-sm mt-2">Your upcoming appointments will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => {
              console.log('Rendering appointment:', item);
              return (
                <div
                  key={item.id || index}
                  className="border border-gray-200 p-6 rounded-lg shadow bg-white relative"
                >
                  
                  {/* Chat Button - Only show for non-completed appointments */}
                  {item.status !== 'COMPLETED' && (
                    <div
                      className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
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
                      className="text-green-600 hover:text-green-800 cursor-pointer flex items-center gap-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
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

                  {/* Appointment Details */}
                  <div className="space-y-2">
                    <p><span className="font-semibold text-gray-700">Booking ID:</span> #{item.id}</p>
                    <p><span className="font-semibold text-gray-700">Customer Name:</span> {item.customer_name}</p>
                    <p><span className="font-semibold text-gray-700">Service:</span> {item.service}</p>
                    <p><span className="font-semibold text-gray-700">Slot:</span> {item.date} | {item.time}</p>
                    <p><span className="font-semibold text-gray-700">Address:</span> {item.address}</p>
                    <p><span className="font-semibold text-gray-700">Phone:</span> {item.phone}</p>
                    <p><span className="font-semibold text-gray-700">Price:</span> ₹{item.price}</p>
                  </div>

                  {/* Completed status message */}
                  {item.status === 'COMPLETED' && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">This appointment is completed.</span> Chat is no longer available.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;