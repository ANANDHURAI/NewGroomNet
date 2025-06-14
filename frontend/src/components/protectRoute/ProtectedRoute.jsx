import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { isLogin, user_type } = useSelector((state) => state.login);

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user_type)) {
    switch (user_type) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'barber':
        return <Navigate to="/barber-dash" replace />;
      case 'customer':
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  return children;
};
export default ProtectedRoute;