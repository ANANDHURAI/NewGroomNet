
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Phone, Video, MoreVertical } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters';

const ChatPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [bookingInfo, setBookingInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat data and initialize WebSocket
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        const userResponse = await apiClient.get('/profile-service/user-profile/');
        setCurrentUser(userResponse.data);

        const messagesResponse = await apiClient.get(`/chat-service/chat/${bookingId}/messages/`);
        setMessages(messagesResponse.data.messages);
        setBookingInfo(messagesResponse.data.booking_info);

        // Initialize WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/chat/${bookingId}/`;
        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => setIsConnected(true);
        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'message') setMessages((prev) => [...prev, data.data]);
        };
        websocket.onclose = () => setIsConnected(false);
        websocket.onerror = () => setIsConnected(false);

        setWs(websocket);
      } catch (err) {
        console.error('Error fetching chat data:', err);
        setError('Failed to load chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();

    return () => {
      if (ws) ws.close();
    };
  }, [bookingId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      if (ws && isConnected) {
        ws.send(JSON.stringify({ message: newMessage.trim() }));
      } else {
        const response = await apiClient.post(`/chat-service/chat/${bookingId}/messages/`, { message: newMessage.trim() });
        setMessages((prev) => [...prev, response.data]);
      }
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const otherUser = bookingInfo?.other_user;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center bg-white border-b">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2>{otherUser?.name}</h2>
          <p>{bookingInfo?.service_name}</p>
        </div>
        <div>
          <Phone size={24} className="mr-2" />
          <Video size={24} className="mr-2" />
          <MoreVertical size={24} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender.id === currentUser.id ? 'text-right' : 'text-left'}>
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full border rounded p-2"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-blue-500 text-white px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
