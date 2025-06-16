// components/protectedRoute/CustomerProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login, logout } from '../../slices/auth/LoginSlice';

const CustomerProtectedRoute = ({ children }) => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto"></div>
          <p className="mt-4 text-blue-200">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!isLogin || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is customer
  if (user_type !== 'customer') {
    // Redirect non-customer users to their appropriate pages
    if (user_type === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user_type === 'barber') {
      if (user.is_active && user.is_verified) {
        return <Navigate to="/barber-dash" replace />;
      } else {
        return <Navigate to="/barber-status" replace />;
      }
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default CustomerProtectedRoute;