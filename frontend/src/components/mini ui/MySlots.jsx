import { Card } from "./Card";
import { Button } from "./Button";
import { useState } from "react";
import { X } from "lucide-react";
import apiClient from "../../slices/api/apiIntercepters";

export const MySlots = ({ slots, onCancelSlot, onRefetch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancelSlot = async (slotId) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiClient.delete(`/barbersite/barber-slots/${slotId}/cancel/`);
      onCancelSlot(slotId);
      onRefetch();
    } catch (error) {
      console.error('Error cancelling slot:', error);
      
      let errorMessage = 'Failed to cancel slot. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 403:
            errorMessage = data.error || 'This slot cannot be cancelled.';
            break;
          case 409:
            errorMessage = 'Cannot delete slot due to existing bookings.';
            break;
          case 500:
            errorMessage = 'Server error. Please contact support.';
            break;
          default:
            errorMessage = data.error || errorMessage;
        }
      }
      
      setError(errorMessage);

      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    if (hourNum === 0) return '12:00 AM';
    if (hourNum < 12) return `${hourNum}:${minute} AM`;
    if (hourNum === 12) return `12:${minute} PM`;
    return `${hourNum - 12}:${minute} PM`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureSlots = slots.filter(slot => new Date(slot.date) >= today);

  if (futureSlots.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">My Slots</h3>
        <p className="text-gray-500 text-center py-8">No upcoming slots scheduled</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">My Slots</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-3">
        {futureSlots.map((slot) => (
          <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">{formatDate(slot.date)}</div>
              <div className="text-sm text-gray-600">
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </div>
              <div className={`text-xs mt-1 ${slot.is_booked ? 'text-green-600' : 'text-blue-600'}`}>
                {slot.is_booked ? 'Booked by customer' : 'Available'}
              </div>
            </div>
            
            <Button
              variant="danger"
              onClick={() => handleCancelSlot(slot.id)}
              disabled={slot.is_booked || loading}
            >
              <X className="w-4 h-4" />
              {loading ? 'Cancelling...' : slot.is_booked ? 'Cannot Cancel' : 'Cancel'}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};