import React, { useState } from 'react';
import apiClient from '../../slices/api/apiIntercepters';

function UserToggleButton({ user, onUserUpdate, size = 'sm', showText = true }) {
    const [loading, setLoading] = useState(false);

    const handleToggleUserStatus = async () => {
        setLoading(true);
        
        try {
            const response = await apiClient.post(`/adminsite/users-block/${user.id}/`);
            
            if (response.status === 200) {
                
                const updatedUser = {
                    ...user,
                    is_blocked: !user.is_blocked,
                   
                    is_active: user.is_blocked 
                };
                
                if (onUserUpdate && typeof onUserUpdate === 'function') {
                    onUserUpdate(updatedUser);
                } else {
                    console.warn('onUserUpdate is not a function or is undefined');
                }
            }
        } catch (error) {
            console.error('Error blocking/unblocking user:', error);
            alert('Failed to update user status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const sizeClasses = {
        sm: {
            button: 'px-3 py-1 text-sm',
            spinner: 'h-3 w-3',
            icon: 'mr-2'
        },
        md: {
            button: 'px-4 py-2 text-base',
            spinner: 'h-4 w-4',
            icon: 'mr-2'
        },
        lg: {
            button: 'px-6 py-3 text-lg',
            spinner: 'h-5 w-5',
            icon: 'mr-3'
        }
    };

    const currentSize = sizeClasses[size] || sizeClasses.sm;

    return (
        <button
            onClick={handleToggleUserStatus}
            disabled={loading}
            className={`${currentSize.button} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                user.is_blocked 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
        >
            {loading ? (
                <span className="flex items-center justify-center">
                    <svg 
                        className={`animate-spin ${currentSize.spinner} text-white ${showText ? currentSize.icon : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {showText && (user.is_blocked ? 'Unblocking...' : 'Blocking...')}
                </span>
            ) : (
                <>
                    {showText ? (user.is_blocked ? 'Unblock User' : 'Block User') : (user.is_blocked ? 'Unblock' : 'Block')}
                </>
            )}
        </button>
    );
}

export default UserToggleButton;