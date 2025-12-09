import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default UserProtectedRoute;