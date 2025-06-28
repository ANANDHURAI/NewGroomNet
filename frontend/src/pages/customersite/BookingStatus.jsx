import React, { useEffect, useState } from 'react';
import apiClient from '../../slices/api/apiIntercepters';
import { Clock } from 'lucide-react';

function BookingStatus({ bookingId }) {
  const [travelStatus, setTravelStatus] = useState('');
  const [eta, setEta] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
    const fetchTravelStatus = async () => {
      try {
        const res = await apiClient.get(`/customersite/travel-status/${bookingId}/`);
        setTravelStatus(res.data.travel_status);
        setEta(res.data.eta);
        setDistance(res.data.distance);
      } catch (err) {
        console.error('Error fetching travel status:', err);
      }
    };

    fetchTravelStatus();
    const interval = setInterval(fetchTravelStatus, 10000);

    return () => clearInterval(interval);
  }, [bookingId]);

  return (
    <div className="bg-white p-6 shadow rounded-lg border border-gray-200 mt-6">
      <div className="flex items-center gap-3 text-gray-700">
        <Clock className="text-blue-500" />
        <div>
          <p className="font-semibold">Barber Status: <span className="text-blue-700">{travelStatus}</span></p>
          <p className="text-sm text-gray-600">ETA: {eta} — Distance: {distance}</p>
        </div>
      </div>
    </div>
  );
}

export default BookingStatus;
