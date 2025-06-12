import React from 'react';
import { useService } from '../../contexts/ServiceContext';

const ServiceCount = () => {
  const { serviceCount } = useService();

  return (
    <div className="relative inline-flex items-center">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
        My Services
      </div>
      {serviceCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
          {serviceCount}
        </div>
      )}
    </div>
  );
};

export default ServiceCount;