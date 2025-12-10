import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RequireBusinessAuth = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has valid business role
  const validRoles = ['BUSINESS_REAL_ESTATE', 'BUSINESS_DELIVERY', 'ADMIN'];
  if (!user || !validRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireBusinessAuth;
