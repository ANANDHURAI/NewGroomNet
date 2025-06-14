export const BackButton = ({ onClick, children }) => (
  <button 
    onClick={onClick}
    className="flex items-center text-gray-600 mb-4 hover:text-gray-800"
  >
    <ArrowLeft className="w-4 h-4 mr-1" />
    {children}
  </button>
);
