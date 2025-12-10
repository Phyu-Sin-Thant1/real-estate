import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, isUser } = useUnifiedAuth();
  const location = useLocation();

  // If not authenticated or not a regular user, redirect to appropriate place
  if (!isAuthenticated || !isUser) {
    // If authenticated but not a user, redirect to appropriate dashboard
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on role would go here
    }
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default UserProtectedRoute;