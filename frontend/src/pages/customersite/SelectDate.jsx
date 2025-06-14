import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters';
import Navbar from '../../components/basics/Navbar';

export const SelectDate = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [params, setParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsObj = {
      service_id: urlParams.get('service_id'),
      service_name: urlParams.get('service_name'),
      barber_id: urlParams.get('barber_id'),
      barber_name: urlParams.get('barber_name')
    };
    setParams(paramsObj);
    
    if (paramsObj.barber_id) {
      fetchAvailableDates(paramsObj.barber_id);
    }
  }, []);

  const fetchAvailableDates = async (barberId) => {
    try {
      const response = await apiClient.get(`/customersite/available-dates/?barber_id=${barberId}`);
      setAvailableDates(response.data.available_dates || []);
    } catch (error) {
      console.error('Error fetching available dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleNext = () => {
    if (selectedDate) {
      const queryParams = new URLSearchParams({
        ...params,
        selected_date: selectedDate
      });
      window.location.href = `/select-time?${queryParams.toString()}`;
    }
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
    <Navbar />
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="text-center mb-8">
        <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Date</h2>
        <p className="text-gray-600">Choose an available date with {params.barber_name}</p>
      </div>

      <div className="space-y-3 mb-8">
        {availableDates.map((date) => (
          <div
            key={date}
            onClick={() => handleDateSelect(date)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedDate === date
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">
                  {formatDate(date)}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              {selectedDate === date && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {availableDates.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No available dates</p>
        </div>
      )}

      {selectedDate && (
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue to Select Time
        </button>
      )}
    </div>
  </div>
);

};

export default SelectDate;