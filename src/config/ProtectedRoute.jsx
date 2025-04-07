import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user, isLoading } = useContext(AuthContext);
  
  // Bypass auth check in development when environment variable is set
  const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === "true";
  console.log("User:", user);

    // Show loading indicator while checking authentication
    if (isLoading && !bypassAuth) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3">Verifying authentication...</p>
        </div>
      );
    }

  // Redirect if not authenticated
  if (!user && !bypassAuth) {
    return <Navigate to="/login" />;
  }
  
  return <Component />;
};

export default ProtectedRoute;