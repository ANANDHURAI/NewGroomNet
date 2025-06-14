import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const { isLogin, user_type } = useSelector((state) => state.login);

  if (isLogin) {
    switch (user_type) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'barber':
        return <Navigate to="/barber-dash" replace />;
      case 'customer':
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default AuthRoute;