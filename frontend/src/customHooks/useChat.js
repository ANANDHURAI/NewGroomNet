export const useChat = (bookingId, userType) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('CONFIRMED');
  
  const wsRef = useRef(null);
  const participantName = "Demo User";

  const initializeWebSocket = () => {
    if (!bookingId) return;
    
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendHost = 'localhost:8000';
    const wsUrl = `${wsProtocol}//${backendHost}/ws/chat/${bookingId}/`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.data) {
            setMessages(prev => {
              const exists = prev.find(msg => msg.id === data.data.id);
              if (exists) return prev;
              return [...prev, data.data];
            });
          } else if (data.type === 'error') {
            console.error('WebSocket error:', data.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
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
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setIsConnected(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get(`/chat-service/chat/${bookingId}/messages/`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isConnected) return;

    // Send via WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        message: newMessage.trim()
      }));
      setNewMessage('');
    } else {
      // Fallback: add message locally for demo
      const demoMessage = {
        id: Date.now(),
        message: newMessage.trim(),
        sender: currentUser,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, demoMessage]);
      setNewMessage('');
    }
  };

  const handleGoBack = () => {
    if (wsRef.current) {
      wsRef.current.close(1000);
    }
    console.log('Going back to appointments');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const userResponse = await apiClient.get('/profile-service/user-profile/');
        setCurrentUser(userResponse.data);

        if (userResponse.data.usertype !== userType) {
          setError(`Access denied. Only ${userType}s can access this chat.`);
          setLoading(false);
          return;
        }

        await fetchMessages();
        initializeWebSocket();
        
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId && bookingId !== 'undefined' && !isNaN(parseInt(bookingId))) {
      fetchData();
    } else {
      setError('Invalid booking ID provided');
      setLoading(false);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000);
      }
    };
  }, [bookingId, userType]);

  return {
    currentUser,
    messages,
    newMessage,
    setNewMessage,
    loading,
    error,
    isConnected,
    bookingStatus,
    participantName,
    handleSendMessage,
    handleGoBack
  };
};