import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters'; 

const SelectBarber = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceId, setServiceId] = useState(null);
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sId = params.get('service_id');
    const sName = params.get('service_name');
    setServiceId(sId);
    setServiceName(sName);
    if (sId) {
      fetchBarbers(sId);
    }
  }, []);

  const fetchBarbers = async (sId) => {
    try {
      const response = await apiClient.get(`/customersite/barbers/?service_id=${sId}`);
      setBarbers(response.data);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarberSelect = (barber) => {
    window.location.href = `/select-date?service_id=${serviceId}&service_name=${serviceName}&barber_id=${barber.id}&barber_name=${barber.name}`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Barber</h2>
          <p className="text-gray-600">Choose your barber for {serviceName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              onClick={() => handleBarberSelect(barber)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={barber.profileimage || '/api/placeholder/60/60'}
                  alt={barber.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {barber.name}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {barber.email}
                    </div>
                    {barber.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {barber.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {barbers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No barbers available for this service</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectBarber;