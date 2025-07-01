export const MessageList = ({ messages, currentUserId, userType }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyChat userType={userType} />;
  }

  return (
    <>
      {messages.map((message, index) => {
        const isOwnMessage = message.sender.id === currentUserId;
        const showDate = index === 0 || 
          formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
        
        return (
          <div key={message.id}>
            {showDate && <DateSeparator date={formatDate(message.timestamp)} />}
            <MessageBubble 
              message={message}
              isOwnMessage={isOwnMessage}
              showSenderName={!isOwnMessage}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </>
  );
};
