import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import BarberSidebar from '../../components/barbercompo/BarberSidebar';
import { MessageCircle, MapPin, Navigation, Square, Clock, AlertCircle } from 'lucide-react';

function Appointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingBookingId, setTrackingBookingId] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
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

  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });

        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationPermission(true);
        return true;
      } catch (error) {
        alert('Location permission is required for travel tracking');
        return false;
      }
    } else {
      alert('Geolocation is not supported by this browser');
      return false;
    }
  };

  const updateLocationPeriodically = () => {
    if (!trackingBookingId) return;

    const locationInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await apiClient.post('/barbersite/update-location/', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          } catch (error) {
            console.error('Failed to update location:', error);
          }
        },
        (error) => console.error('Location update failed:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
      );
    }, 10000);

    return locationInterval;
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let locationInterval;
    if (trackingBookingId) {
      locationInterval = updateLocationPeriodically();
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval);
    };
  }, [trackingBookingId]);

  const handleChatClick = (appointment) => {
    navigate(`/barber/chat/${appointment.id}`, {
      state: {
        appointmentData: appointment,
        customerName: appointment.customer_name
      }
    });
  };

  const handleViewMap = (appointment) => {
    const query = encodeURIComponent(appointment.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleStartTravel = async (appointment) => {
    const hasPermission = locationPermission || await requestLocationPermission();

    if (!hasPermission || !currentLocation) return;

    try {
      await apiClient.post('/barbersite/start-travel/', {
        booking_id: appointment.id,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      });

      setTrackingBookingId(appointment.id);
      setData(prev =>
        prev.map(item => item.id === appointment.id ? { ...item, status: 'TRAVELLING' } : item)
      );
    } catch (err) {
      alert('Failed to start travel');
    }
  };

  const handleStopTravel = async () => {
    try {
      await apiClient.post('/barbersite/stop-travel/');
      setData(prev =>
        prev.map(item => item.id === trackingBookingId ? { ...item, status: 'ARRIVED' } : item)
      );
      setTrackingBookingId(null);
    } catch (err) {
      alert('Failed to stop travel');
    }
  };

  const handleMarkInProgress = async (appointment) => {
    try {
      await apiClient.patch(`/barbersite/booking/${appointment.id}/`, {
        status: 'IN_PROGRESS'
      });
      setData(prev =>
        prev.map(item => item.id === appointment.id ? { ...item, status: 'IN_PROGRESS' } : item)
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleMarkCompleted = async (appointment) => {
    try {
      await apiClient.patch(`/barbersite/booking/${appointment.id}/`, {
        status: 'COMPLETED'
      });
      setData(prev =>
        prev.map(item => item.id === appointment.id ? { ...item, status: 'COMPLETED' } : item)
      );
    } catch (err) {
      alert('Failed to mark as completed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'TRAVELLING': return 'bg-orange-100 text-orange-800';
      case 'ARRIVED': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-indigo-100 text-indigo-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (appointment) => {
    const { status, id } = appointment;

    switch (status) {
      case 'CONFIRMED':
        return trackingBookingId === id ? (
          <button onClick={handleStopTravel} className="bg-red-600 text-white px-4 py-2 mt-4 rounded">
            <Square size={16} className="inline mr-2" />
            Mark as Arrived
          </button>
        ) : (
          <button onClick={() => handleStartTravel(appointment)} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
            <Navigation size={16} className="inline mr-2" />
            Start Travel
          </button>
        );

      case 'TRAVELLING':
        return (
          <button onClick={handleStopTravel} className="bg-purple-600 text-white px-4 py-2 mt-4 rounded">
            <Square size={16} className="inline mr-2" />
            Mark as Arrived
          </button>
        );

      case 'ARRIVED':
        return (
          <button onClick={() => handleMarkInProgress(appointment)} className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded">
            Start Service
          </button>
        );

      case 'IN_PROGRESS':
        return (
          <button onClick={() => handleMarkCompleted(appointment)} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">
            Complete Service
          </button>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-[#0f172a] text-white"><BarberSidebar /></div>
        <div className="flex-1 p-8 flex justify-center items-center">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-[#0f172a] text-white"><BarberSidebar /></div>
        <div className="flex-1 p-8 flex justify-center items-center">
          <AlertCircle className="text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-[#0f172a] text-white"><BarberSidebar /></div>
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          {trackingBookingId && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-400">
              <Clock size={16} className="animate-pulse" />
              Tracking Active
            </div>
          )}
        </div>

        {data.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.id} className="bg-white shadow rounded p-6 relative border">
                {/* Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleViewMap(item)} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded flex items-center gap-1">
                    <MapPin size={16} />
                    Map
                  </button>
                  {item.status !== 'COMPLETED' && (
                    <button onClick={() => handleChatClick(item)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded flex items-center gap-1">
                      <MessageCircle size={16} />
                      Chat
                    </button>
                  )}
                </div>

                {/* Status */}
                <div className="mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  {trackingBookingId === item.id && (
                    <span className="ml-2 text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                      LIVE TRACKING
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p><strong>Booking ID:</strong> #{item.id}</p>
                    <p><strong>Customer:</strong> {item.customer_name}</p>
                    <p><strong>Service:</strong> {item.service}</p>
                    <p><strong>Booking Type:</strong> {item.booking_type?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p><strong>Date & Time:</strong> {item.date} | {item.time}</p>
                    <p><strong>Phone:</strong> {item.phone}</p>
                    <p><strong>Price:</strong> ₹{item.price}</p>
                    <p><strong>Address:</strong> {item.address}</p>
                  </div>
                </div>

                {/* Actions */}
                {getStatusActions(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
