// components/protectedRoute/BarberProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login, logout } from '../../slices/auth/LoginSlice';

const BarberProtectedRoute = ({ children, requireVerification = true }) => {
  const { isLogin, user, user_type } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUserData = localStorage.getItem('user_data');
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedUserType = localStorage.getItem('user_type');

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-orange-800 to-red-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300 mx-auto"></div>
          <p className="mt-4 text-amber-200">Loading Barber Dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!isLogin || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is barber
  if (user_type !== 'barber') {
    // Redirect non-barber users to their appropriate pages
    if (user_type === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user_type === 'customer') {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // Check barber verification status if required
  if (requireVerification) {
    if (!user.is_active || !user.is_verified) {
      return <Navigate to="/barber-status" replace />;
    }
  }

  return children;
};

export default BarberProtectedRoute;