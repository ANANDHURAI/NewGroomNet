export const MessageBubble = ({ message, isOwnMessage, showSenderName }) => (
  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
      isOwnMessage 
        ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
        : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg border'
    } px-4 py-2 shadow-sm`}>
      {!isOwnMessage && showSenderName && (
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
);