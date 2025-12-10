import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

const RequireBusinessAuth = () => {
  const { isAuthenticated, user, isBusinessRealEstate, isBusinessDelivery, isAdmin } = useUnifiedAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has valid business role
  if (!(isBusinessRealEstate || isBusinessDelivery || isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireBusinessAuth;
