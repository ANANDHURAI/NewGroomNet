import React, { useEffect, useState } from 'react';
import { Clock, MapPin, User, Phone, Calendar, DollarSign, Navigation, CheckCircle } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters';

function BookingStatus({ bookingId }) {
  const [travelStatus, setTravelStatus] = useState('');
  const [eta, setEta] = useState('');
  const [distance, setDistance] = useState('');
  const [barberLocation, setBarberLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTravelStatus = async () => {
    try {
      const res = await apiClient.get(`/travel-tracking/travel-status/${bookingId}/`);
      const data = res.data;
      setTravelStatus(data.travel_status);
      setEta(data.eta);
      setDistance(data.distance);
      setBarberLocation(data.barber_location);
      setCustomerLocation(data.customer_location);
    } catch (err) {
      console.error('Error fetching travel status:', err);
    }
  };

  const fetchBookingDetails = async () => {
    try {
      const res = await apiClient.get(`/customersite/booking-details/${bookingId}/`);
      setBookingDetails(res.data);
    } catch (err) {
      console.error('Error fetching booking details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    if (bookingDetails?.status === 'TRAVELLING' || bookingDetails?.status === 'ARRIVED') {
      fetchTravelStatus();
      const interval = setInterval(fetchTravelStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [bookingDetails?.status]);

  const openMaps = () => {
    if (barberLocation && customerLocation) {
      const url = `https://www.google.com/maps/dir/${barberLocation.latitude},${barberLocation.longitude}/${customerLocation.latitude},${customerLocation.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return ['text-blue-600', 'Your appointment is confirmed.'];
      case 'TRAVELLING':
        return ['text-orange-600', 'Your barber is on the way.'];
      case 'ARRIVED':
        return ['text-purple-600', 'Your barber has arrived.'];
      case 'IN_PROGRESS':
        return ['text-indigo-600', 'Your service is in progress.'];
      case 'COMPLETED':
        return ['text-green-600', 'Service completed.'];
      default:
        return ['text-gray-600', 'Awaiting confirmation.'];
    }
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-pulse text-gray-500">Loading booking details...</div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
        Booking not found.
      </div>
    );
  }

  const [statusColor, statusMessage] = getStatusDetails(bookingDetails.status);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <h2 className="text-2xl font-bold">Booking #{bookingDetails.id}</h2>
          <p>{bookingDetails.service}</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><User className="inline-block w-4 h-4 mr-2" />Barber: <strong>{bookingDetails.barber_name}</strong></p>
            <p><Phone className="inline-block w-4 h-4 mr-2" />Phone: <strong>{bookingDetails.barber_phone}</strong></p>
          </div>
          <div className="space-y-2">
            <p><Calendar className="inline-block w-4 h-4 mr-2" />Date & Time: <strong>{bookingDetails.date} at {bookingDetails.time}</strong></p>
            <p><DollarSign className="inline-block w-4 h-4 mr-2" />Price: <strong>₹{bookingDetails.price}</strong></p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <div className={`text-lg font-semibold mb-2 ${statusColor}`}>{bookingDetails.status.replace('_', ' ')}</div>
        <p className="text-gray-700">{statusMessage}</p>

        {(bookingDetails.status === 'TRAVELLING' || bookingDetails.status === 'ARRIVED') && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 font-medium">Live Tracking</h3>
              {barberLocation && customerLocation && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={openMaps}
                >
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  View Route
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg text-center p-4">
                <Clock className="mx-auto text-blue-600 mb-2" />
                <div className="text-gray-500 text-sm">ETA</div>
                <div className="text-lg font-semibold text-gray-800">{eta || '...'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg text-center p-4">
                <Navigation className="mx-auto text-green-600 mb-2" />
                <div className="text-gray-500 text-sm">Distance</div>
                <div className="text-lg font-semibold text-gray-800">{distance || '...'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg text-center p-4">
                <div className={`w-3 h-3 mx-auto rounded-full ${travelStatus === 'On the way' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                <div className="text-gray-500 text-sm mt-2">Status</div>
                <div className="text-lg font-semibold text-gray-800">{travelStatus || '...'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <p className="text-sm text-gray-500 mb-1">Service Location</p>
        <p className="text-gray-800 font-semibold">{bookingDetails.address}</p>
      </div>
    </div>
  );
}

export default BookingStatus;
