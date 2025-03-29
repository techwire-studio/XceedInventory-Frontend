import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useContext(AuthContext);
  
  // Bypass auth check in development when environment variable is set
  const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === "true";
  
  if (!user && !bypassAuth) {
    return <Navigate to="/login" />;
  }
  
  return <Component />;
};

export default ProtectedRoute;