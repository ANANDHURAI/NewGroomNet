import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Send, ArrowLeft, User } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters';
import BarberLayout from '../../components/chatcomponents/BarberLayout';
import { OnlineStatus , TypingIndicator , useTypingIndicator } from '../../components/chatcomponents/ChatStatusIndicators';
import BarberSidebar from '../../components/barbercompo/BarberSidebar';

function BarberChatPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);

  const appointmentData = location.state?.appointmentData;
  const customerName = location.state?.customerName;

  const { 
    isOtherUserTyping, 
    handleInputChange, 
    handleWebSocketMessage 
  } = useTypingIndicator(websocketRef, bookingId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [messagesRes, bookingRes] = await Promise.all([
          apiClient.get(`/chat-service/chat/${bookingId}/messages/`),
          apiClient.get(`/chat-service/chat/${bookingId}/info/`)
        ]);
        
        setMessages(messagesRes.data.messages || []);
        setBookingInfo(bookingRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const token = sessionStorage.getItem('access_token');
    const wsUrl = `${protocol}//localhost:8000/ws/chat/${bookingId}/?token=${token}`;
    
    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      const userStatus = handleWebSocketMessage(data);
      if (userStatus !== undefined) {
        setIsOtherUserOnline(userStatus);
        return;
      }
      
      if (data.type === 'message') {
        setMessages(prevMessages => {
          const messageExists = prevMessages.some(msg => msg.id === data.data.id);
          if (messageExists) {
            return prevMessages;
          }
          return [...prevMessages, data.data];
        });
      } else if (data.type === 'error') {
        alert(data.message);
      }
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [bookingId, handleWebSocketMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {

      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          message: newMessage.trim()
        }));
        setNewMessage('');
      } else {
        throw new Error('WebSocket not connected');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
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
      <BarberLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading chat...</div>
        </div>
      </BarberLayout>
    );
  }

  return (
    <BarberLayout>
      <div className="flex flex-1 h-screen overflow-hidden">
        <BarberSidebar />

        <div className="flex-1 flex flex-col h-full">
          <div className="flex flex-col flex-1 bg-white rounded-lg shadow-lg m-4 overflow-hidden">
            
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
              <button
                onClick={() => navigate('/barber/appointments')}
                className="flex items-center text-white hover:text-green-200 mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Appointments
              </button>

              {bookingInfo && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {bookingInfo.other_user.profile_image ? (
                      <img
                        src={bookingInfo.other_user.profile_image}
                        alt={bookingInfo.other_user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {bookingInfo.other_user.name || customerName}
                    </h2>
                    <p className="text-sm text-green-100">
                      {bookingInfo.service_name} • {bookingInfo.booking_date} at {bookingInfo.booking_time}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-green-200">Status: {bookingInfo.status}</p>
                      <OnlineStatus isOnline={isOtherUserOnline} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet. Start the conversation with your customer!</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isCurrentUser = message.sender.id === bookingInfo?.current_user_id;
                  const showDate =
                    index === 0 ||
                    formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center text-gray-500 text-sm py-2">
                          {formatDate(message.timestamp)}
                        </div>
                      )}
                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? 'bg-green-600 text-white'
                              : 'bg-white text-gray-800 border'
                          }`}
                        >
                          {!isCurrentUser && (
                            <p className="text-xs text-gray-500 mb-1">{message.sender.name}</p>
                          )}
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-green-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <TypingIndicator
                isTyping={isOtherUserTyping}
                userName={bookingInfo?.other_user.name || customerName}
                colorTheme="green"
              />

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleInputChange(e.target.value, setNewMessage)}
                  placeholder="Type your message to customer..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </BarberLayout>

  );
}

export default BarberChatPage;