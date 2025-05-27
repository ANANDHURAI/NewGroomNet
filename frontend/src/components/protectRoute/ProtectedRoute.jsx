import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isLogin = useSelector(state => state.login.isLogin);
    const hasToken = localStorage.getItem('access_token');
    
    return (isLogin || hasToken) ? children : <Navigate to="/login" replace />;
}



export default ProtectedRoute;