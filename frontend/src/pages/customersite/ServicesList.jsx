import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catId = params.get('category_id');
    setCategoryId(catId);
    fetchServices(catId);
  }, []);

  const fetchServices = async (catId) => {
    try {
      const url = catId 
        ? `/customersite/services/?category_id=${catId}` 
        : '/customersite/services/';
      
      const response = await apiClient.get(url);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    window.location.href = `/select-barber?service_id=${service.id}&service_name=${service.name}`;
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Service</h2>
          <p className="text-gray-600">Choose the service you need</p>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={service.image || '/api/placeholder/80/80'}
                  alt={service.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ₹{service.price}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration_minutes} min
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No services available for this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;