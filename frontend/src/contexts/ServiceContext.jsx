import React, { createContext, useContext, useState, useCallback } from 'react';
import apiClient from '../slices/api/apiIntercepters';

const ServiceContext = createContext();

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};

export const ServiceProvider = ({ children }) => {
  const [myServices, setMyServices] = useState([]);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMyServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/barbersite/barber-services/my_services/');
      setMyServices(response.data.services);
      setServiceCount(response.data.count);
    } catch (error) {
      console.error('Error fetching my services:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = useCallback(async (serviceId) => {
    try {
      const response = await apiClient.post('/barbersite/barber-services/add_service/', {
        service_id: serviceId
      });
      await fetchMyServices(); // Refresh the list
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding service:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to add service' };
    }
  }, [fetchMyServices]);

  const removeService = useCallback(async (barberServiceId) => {
    try {
      await apiClient.delete(`/barbersite/barber-services/${barberServiceId}/remove_service/`);
      await fetchMyServices(); 
      return { success: true };
    } catch (error) {
      console.error('Error removing service:', error);
      return { success: false, error: 'Failed to remove service' };
    }
  }, [fetchMyServices]);

  const value = {
    myServices,
    serviceCount,
    loading,
    fetchMyServices,
    addService,
    removeService
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};