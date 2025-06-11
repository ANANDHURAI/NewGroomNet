import React from 'react';

const LocationModal = ({ isOpen, onEnableLocation, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Enable Location Access
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            GroomNet needs your location to show nearby services and provide the best experience. 
            Your location data is secure and only used to enhance your service discovery.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onEnableLocation}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Enable Location
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Not Now
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-3">
            You can change this in your browser settings anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;