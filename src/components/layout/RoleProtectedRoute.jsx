import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

// Route that requires a specific role
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isUser, isBusinessRealEstate, isBusinessDelivery, isAdmin } = useUnifiedAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has one of the allowed roles
  const userRole = user?.role;
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (isUser) {
      return <Navigate to="/" replace />;
    } else if (isBusinessRealEstate || isBusinessDelivery || isAdmin) {
      return <Navigate to="/business" replace />;
    } else if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    
    // Fallback redirect
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;