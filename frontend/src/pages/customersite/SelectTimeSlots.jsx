import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters';

export const SelectTime = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [params, setParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsObj = {
      service_id: urlParams.get('service_id'),
      service_name: urlParams.get('service_name'),
      barber_id: urlParams.get('barber_id'),
      barber_name: urlParams.get('barber_name'),
      selected_date: urlParams.get('selected_date')
    };
    setParams(paramsObj);
    
    if (paramsObj.barber_id && paramsObj.selected_date) {
      fetchTimeSlots(paramsObj.barber_id, paramsObj.selected_date);
    }
  }, []);

  const fetchTimeSlots = async (barberId, date) => {
    try {
      const response = await apiClient.get(`/customersite/available-slots/?barber_id=${barberId}&date=${date}`);
      setTimeSlots(response.data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleNext = () => {
    if (selectedSlot) {
      const queryParams = new URLSearchParams({
        ...params,
        slot_id: selectedSlot.id,
        slot_time: `${selectedSlot.start_time} - ${selectedSlot.end_time}`
      });
      window.location.href = `/add-address?${queryParams.toString()}`;
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
      <div className="max-w-2xl mx-auto p-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Time</h2>
          <p className="text-gray-600">Choose your preferred time for</p>
          <p className="text-blue-600 font-medium">{formatDate(params.selected_date)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSlotSelect(slot)}
              className={`p-3 rounded-lg border-2 text-sm transition-all ${
                selectedSlot?.id === slot.id
                  ? 'border-blue-500 bg-blue-600 text-white'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
              }`}
            >
              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
            </button>
          ))}
        </div>

        {timeSlots.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No time slots available for this date</p>
          </div>
        )}

        {selectedSlot && (
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Add Address
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectTime;