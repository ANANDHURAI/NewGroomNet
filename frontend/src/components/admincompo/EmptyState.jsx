import React from 'react';

const EmptyState = ({ icon, title, description }) => {
    return (
        <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    );
};

export default EmptyState;