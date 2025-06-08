import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
            <p className="mt-4 text-gray-600 font-medium">{text}</p>
        </div>
    );
};

export default LoadingSpinner;