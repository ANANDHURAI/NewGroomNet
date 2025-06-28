import React, { useEffect, useState } from 'react';
import apiClient from '../../slices/api/apiIntercepters';
import { useParams } from 'react-router-dom';
import CustomerLayout from '../../components/customercompo/CustomerLayout';
import { Truck, Clock, MessageSquare } from 'lucide-react';

function BookingDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [travelStatus, setTravelStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    apiClient.get(`/customersite/booking-details/${id}/`)
      .then(res => {
        setData(res.data);
        calculateTimeLeft(res.data.date, res.data.start_time);
        fetchTravelStatus(res.data.orderid);
      })
      .catch(err => console.error("Booking fetch error", err));
  }, []);

  const calculateTimeLeft = (date, time) => {
    const serviceTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = serviceTime - now;
    if (diff <= 0) return setTimeLeft("Service is active now");

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    setTimeLeft(`${hrs}h ${rem}m remaining`);
  };

  const fetchTravelStatus = async (bookingId) => {
    try {
      const res = await apiClient.get(`/customersite/travel-status/${bookingId}/`);
      setTravelStatus(res.data);
    } catch (err) {
      console.warn("Travel status not available");
    }
  };

  return (
    <CustomerLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Details</h2>

      {data && (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Order ID:</strong> #{data.orderid}</p>
              <p><strong>Service:</strong> {data.service}</p>
              <p><strong>Status:</strong> {data.booking_status}</p>
            </div>
            <div>
              <p><strong>Customer:</strong> {data.name}</p>
              <p><strong>Barber:</strong> {data.barbername}</p>
            </div>
            <div>
              <p><strong>Date:</strong> {data.date}</p>
              <p><strong>Time:</strong> {data.slottime}</p>
              <p className="text-sm text-blue-600">{timeLeft}</p>
            </div>
            <div>
              <p><strong>Payment:</strong> {data.payment_method}</p>
              <p><strong>Amount:</strong> ₹{data.total_amount}</p>
            </div>
          </div>

          {data.booking_status === 'CONFIRMED' && travelStatus && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mt-4">
              <h3 className="text-blue-800 flex items-center gap-2 font-semibold mb-2">
                <Truck size={18} /> Travel Status
              </h3>
              <p><strong>Status:</strong> {travelStatus.travel_status}</p>
              <p>
                <Clock size={14} className="inline mr-1" />
                <strong>ETA:</strong> {travelStatus.eta} | Distance: {travelStatus.distance}
              </p>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => alert('Start chat')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <MessageSquare size={18} /> Chat with Barber
            </button>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}

export default BookingDetailsPage;
