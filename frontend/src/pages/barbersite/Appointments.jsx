import React, { useEffect, useState } from 'react';
import apiClient from '../../slices/api/apiIntercepters';
import BarberSidebar from '../../components/barbercompo/BarberSidebar';

function Appointments() {
  const [data, setData] = useState([]);

  useEffect(() => {
    apiClient.get('barbersite/barber-appointments/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-[#0f172a] text-white">
        <BarberSidebar />
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>

        {data.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 p-6 rounded-lg shadow bg-white"
              >
                <p><span className="font-semibold text-gray-700">Customer Name:</span> {item.customer_name}</p>
                <p><span className="font-semibold text-gray-700">Service:</span> {item.service}</p>
                <p><span className="font-semibold text-gray-700">Slot:</span> {item.date} | {item.time}</p>
                <p><span className="font-semibold text-gray-700">Address:</span> {item.address}</p>
                <p><span className="font-semibold text-gray-700">Phone:</span> {item.phone}</p>
                <p><span className="font-semibold text-gray-700">Price:</span> ₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
