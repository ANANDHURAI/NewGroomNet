import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login, logout } from '../../slices/auth/LoginSlice';
import LoadingSpinner from '../admincompo/LoadingSpinner';

const ProtectedRoute = ({ children, allowedUserTypes = [], requireVerification = false }) => {
  const { isLogin, user, user_type } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUserData = sessionStorage.getItem('user_data');
    const storedAccessToken = sessionStorage.getItem('access_token');
    const storedRefreshToken = sessionStorage.getItem('refresh_token');
    const storedUserType = sessionStorage.getItem('user_type');

    if (storedUserData && storedAccessToken && storedRefreshToken && storedUserType && !isLogin) {
      try {
        const userData = JSON.parse(storedUserData);
        dispatch(login({
          user: userData,
          access: storedAccessToken,
          refresh: storedRefreshToken
        }));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        dispatch(logout());
      }
    }
    setLoading(false);
  }, [dispatch, isLogin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner/>
      </div>
    );
  }
  
  if (!isLogin || !user) {

    if (window.location.pathname.includes('admin')) {
      return <Navigate to="/admin-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user_type)) {
    if (user_type === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user_type === 'barber') {
      if (user.is_active && user.is_verified) {
        return <Navigate to="/barber-dash" replace />;
      } else {
        return <Navigate to="/barber-status" replace />;
      }
    } else if (user_type === 'customer') {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  if (requireVerification && user_type === 'barber') {
    if (!user.is_active || !user.is_verified) {
      return <Navigate to="/barber-status" replace />;
    }
  }

  if (window.location.pathname === '/barber-status' && user_type === 'barber') {
    if (user.is_active && user.is_verified) {
      return <Navigate to="/barber-dash" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;