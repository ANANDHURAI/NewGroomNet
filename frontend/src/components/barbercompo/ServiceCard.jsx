import React, { useState } from 'react';
import { useService } from '../../contexts/ServiceContext.jsx';

const ServiceCard = ({ service, showAddButton = false, showRemoveButton = false, barberServiceId = null }) => {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { addService, removeService } = useService();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const handleAddService = async () => {
    setIsAdding(true);
    const result = await addService(service.id);
    if (!result.success) {
      alert(result.error);
    }
    setIsAdding(false);
  };

  const handleRemoveService = async () => {
    if (!barberServiceId) return;
    setIsRemoving(true);
    const result = await removeService(barberServiceId);
    if (!result.success) {
      alert(result.error);
    }
    setIsRemoving(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 bg-gradient-to-br from-green-400 to-blue-500 relative">
        {service.image && !imageError ? (
          <img 
            src={getImageUrl(service.image)} 
            alt={service.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">💇</div>
              <span className="text-sm font-medium">{service.name}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
        {service.description && (
          <p className="text-gray-600 text-sm mb-3">{service.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-green-600">${service.price}</span>
          <span className="text-gray-500 text-sm">{service.duration_minutes} min</span>
        </div>

        {showAddButton && (
          <button
            onClick={handleAddService}
            disabled={isAdding}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              'Add Service'
            )}
          </button>
        )}

        {showRemoveButton && (
          <button
            onClick={handleRemoveService}
            disabled={isRemoving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isRemoving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Removing...
              </>
            ) : (
              'Remove Service'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;