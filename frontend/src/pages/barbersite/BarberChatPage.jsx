import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, User } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters';

const BarberChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const appointmentFromState = location.state?.appointmentData;
  const customerName = location.state?.customerName;

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    if (!id) return;
    
    // Get WebSocket URL - adjust based on your setup
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendHost = 'localhost:8000'; // your Django backend's port
    const wsUrl = `${wsProtocol}//${backendHost}/ws/chat/${id}/`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message' && data.data) {
          setMessages(prev => [...prev, data.data]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      
      // Auto-reconnect after 3 seconds if not a manual close
      if (event.code !== 1000) {
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          initializeWebSocket();
        }, 3000);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  // Fetch initial data
  useEffect(() => {
    if (!id || id === 'undefined' || isNaN(parseInt(id))) {
      setError('Invalid booking ID provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await apiClient.get('/profile-service/user-profile/');
        console.log('User profile response:', userResponse.data);
        setCurrentUser(userResponse.data);

        if (userResponse.data.usertype !== 'barber') {
          setError('Access denied. Only barbers can access this chat.');
          setLoading(false);
          return;
        }

        // Check booking status - Adjust endpoint based on your backend
        try {
          const bookingStatusResponse = await apiClient.get(`/chat/booking/${id}/status/`);
          const bookingStatusData = bookingStatusResponse.data;
          setBookingStatus(bookingStatusData.status);
          
          if (bookingStatusData.status === 'COMPLETED') {
            setError('This booking has been completed and chat is no longer accessible.');
            setLoading(false);
            return;
          }
        } catch (statusError) {
          console.warn('Could not fetch booking status, proceeding with chat...');
          setBookingStatus('CONFIRMED'); // Default status
        }

        // Fetch chat messages
        const messagesResponse = await apiClient.get(`/chat/chat/${id}/messages/`);
        console.log('Messages response:', messagesResponse.data);
        setMessages(messagesResponse.data);

        setAppointmentData({
          appointmentId: id,
          customerName: customerName || appointmentFromState?.customer_name || 'Customer',
          bookingStatus: bookingStatus || 'CONFIRMED'
        });

        // Initialize WebSocket
        initializeWebSocket();
        
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        if (error.response?.status === 404) {
          setError('Booking not found or you do not have access to this chat.');
        } else if (error.response?.status === 403) {
          setError('Access denied. You are not authorized to view this chat.');
        } else if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError('Failed to load chat. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup WebSocket on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [id, customerName, appointmentFromState]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    try {
      // Try WebSocket first
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          message: messageText
        }));
      } else {
        // Fallback to HTTP API
        console.log('WebSocket not available, using HTTP API');
        const response = await apiClient.post(`/chat/chat/${id}/send/`, { 
          message: messageText 
        });
        
        // Add message to UI if not added by WebSocket
        if (response.data) {
          setMessages(prev => [...prev, response.data]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message to input on error
      setNewMessage(messageText);
      
      if (error.response?.status === 400) {
        alert('Cannot send messages to completed or cancelled bookings.');
      } else {
        alert('Failed to send message. Please try again.');
      }
    }
  };

  const handleGoBack = () => {
    navigate('/barber/appointments');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading chat...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-lg mb-2 font-semibold">Error</div>
          <div className="text-gray-600 mb-6">{error}</div>
          <button 
            onClick={handleGoBack}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Back to appointments"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {appointmentData?.customerName || 'Customer'}
              </h1>
              <p className="text-sm text-gray-500">
                Booking #{id} • {bookingStatus || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No messages yet</p>
            <p className="text-gray-400 text-sm">Start the conversation with your customer</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender.id === currentUser?.id;
              const showDate = index === 0 || 
                formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center mb-4">
                      <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      isOwnMessage 
                        ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
                        : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg border'
                    } px-4 py-2 shadow-sm`}>
                      {!isOwnMessage && (
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          {message.sender.name}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                      <div className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={bookingStatus === 'COMPLETED'}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || bookingStatus === 'COMPLETED'}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
        
        {!isConnected && (
          <div className="text-center mt-2">
            <span className="text-sm text-amber-600">
              Connection lost. Messages will be sent via backup method.
            </span>
          </div>
        )}
        
        {bookingStatus === 'COMPLETED' && (
          <div className="text-center mt-2">
            <span className="text-sm text-gray-500">
              This booking is completed. Chat is no longer available.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberChatPage;