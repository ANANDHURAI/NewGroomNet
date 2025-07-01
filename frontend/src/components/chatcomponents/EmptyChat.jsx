export const EmptyChat = ({ userType }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
      <User size={24} className="text-gray-400" />
    </div>
    <p className="text-gray-500 text-lg mb-2">No messages yet</p>
    <p className="text-gray-400 text-sm">
      Start the conversation with your {userType === 'barber' ? 'customer' : 'barber'}
    </p>
  </div>
);