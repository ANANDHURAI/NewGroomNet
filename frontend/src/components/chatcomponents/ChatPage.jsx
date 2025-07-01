export const ChatPage = ({ userType = 'barber', bookingId = '123' }) => {
  const {
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
  } = useChat(bookingId, userType);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onGoBack={handleGoBack} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ChatHeader 
        onGoBack={handleGoBack}
        participantName={participantName}
        bookingId={bookingId}
        bookingStatus={bookingStatus}
        isConnected={isConnected}
        userType={userType}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList 
          messages={messages}
          currentUserId={currentUser?.id}
          userType={userType}
        />
      </div>

      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        bookingStatus={bookingStatus}
        isConnected={isConnected}
      />
    </div>
  );
};

// Demo with tabs to switch between barber and customer view
const ChatDemo = () => {
  const [activeTab, setActiveTab] = useState('barber');

  return (
    <div className="h-screen">
      <div className="bg-gray-800 text-white p-4 flex gap-4">
        <button
          onClick={() => setActiveTab('barber')}
          className={`px-4 py-2 rounded ${activeTab === 'barber' ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Barber View
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-4 py-2 rounded ${activeTab === 'customer' ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Customer View
        </button>
      </div>
      <div className="h-full">
        <ChatPage userType={activeTab} bookingId="123" />
      </div>
    </div>
  );
};

export default ChatDemo;