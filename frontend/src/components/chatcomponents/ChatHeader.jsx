export const ChatHeader = ({ 
  onGoBack, 
  participantName, 
  bookingId, 
  bookingStatus, 
  isConnected,
  userType 
}) => (
  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <button
        onClick={onGoBack}
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
            {participantName || (userType === 'barber' ? 'Customer' : 'Barber')}
          </h1>
          <p className="text-sm text-gray-500">
            Booking #{bookingId} • {bookingStatus || 'Loading...'}
          </p>
        </div>
      </div>
    </div>
    <ConnectionStatus isConnected={isConnected} />
  </div>
);