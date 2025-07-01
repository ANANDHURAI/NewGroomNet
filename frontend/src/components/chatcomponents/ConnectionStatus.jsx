
const ConnectionStatus = ({ isConnected }) => (
  <div className="flex items-center gap-2">
    <Circle
      size={8}
      className={`${isConnected ? 'text-green-500 fill-current' : 'text-red-500 fill-current'}`}
    />
    <span className="text-sm text-gray-500">
      {isConnected ? 'Connected' : 'Disconnected'}
    </span>
  </div>
);