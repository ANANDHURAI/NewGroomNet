import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { syncWithStorage } from '../../slices/auth/LoginSlice';

function AdminProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const isLogin = useSelector(state => state.login.isLogin);
    const isAdmin = useSelector(state => state.login.isAdmin);
    
    useEffect(() => {
        dispatch(syncWithStorage());
    }, [dispatch]);

    const hasToken = localStorage.getItem('access_token');
    const isAdminInStorage = localStorage.getItem('is_admin') === 'true';

    const isAuthenticated = (isLogin || hasToken) && (isAdmin || isAdminInStorage);

    if (isAuthenticated) {
        return children;
    }

    return <Navigate to="/admin-login" replace />;
}

export default AdminProtectedRoute;