import React, { useState, useEffect } from 'react';

export const ProfileField = ({ label, icon, children, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 flex items-center">
            {icon && <span className="w-4 h-4 mr-2 text-gray-500">{icon}</span>}
            {label}
        </label>
        {children}
    </div>
);
