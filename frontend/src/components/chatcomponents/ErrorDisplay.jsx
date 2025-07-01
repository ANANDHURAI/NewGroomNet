export const ErrorDisplay = ({ error, onGoBack }) => (
  <div className="h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="text-red-600 text-lg mb-2 font-semibold">Error</div>
      <div className="text-gray-600 mb-6">{error}</div>
      <button 
        onClick={onGoBack}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Appointments
      </button>
    </div>
  </div>
);