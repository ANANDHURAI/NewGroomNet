import React from 'react';

export const OnlineStatus = ({ isOnline }) => {
  return (
    <div className="flex items-center space-x-1">
      <div 
        className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      <span className="text-xs text-white/80">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};


export const TypingIndicator = ({ isTyping, userName, colorTheme = 'blue' }) => {
  if (!isTyping) return null;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800'
  };

  return (
    <div className="flex justify-start mb-2">
      <div className={`max-w-xs px-4 py-2 rounded-lg ${colorClasses[colorTheme]}`}>
        <div className="flex items-center space-x-1">
          <span className="text-sm">{userName} is typing</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};


export const useTypingIndicator = (websocketRef, bookingId) => {
  const [isOtherUserTyping, setIsOtherUserTyping] = React.useState(false);
  const [typingTimeout, setTypingTimeout] = React.useState(null);
  const typingTimeoutRef = React.useRef(null);

  const sendTypingIndicator = React.useCallback((isTyping) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'typing',
        is_typing: isTyping
      }));
    }
  }, [websocketRef]);


  const handleInputChange = React.useCallback((value, onChange) => {
    onChange(value);
    
    sendTypingIndicator(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 1000);
  }, [sendTypingIndicator]);


  const handleWebSocketMessage = React.useCallback((data) => {
    if (data.type === 'typing') {
      setIsOtherUserTyping(data.is_typing);
      
      if (data.is_typing) {
        if (typingTimeout) clearTimeout(typingTimeout);
        const timeout = setTimeout(() => {
          setIsOtherUserTyping(false);
        }, 3000);
        setTypingTimeout(timeout);
      }
    } else if (data.type === 'user_status') {
      return data.is_online;
    }
  }, [typingTimeout]);

  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return {
    isOtherUserTyping,
    handleInputChange,
    handleWebSocketMessage,
    sendTypingIndicator
  };
};