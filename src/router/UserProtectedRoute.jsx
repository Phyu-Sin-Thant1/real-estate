import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";

/**
 * Usage:
 * <UserProtectedRoute allowedRoles={["BUSINESS_REAL_ESTATE", "ADMIN"]}>
 *   <RealEstateDashboardPage />
 * </UserProtectedRoute>
 */
const UserProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useUnifiedAuth();
  const location = useLocation();

  // Not logged in at all → go to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Logged in but with wrong role → redirect appropriately
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If ADMIN tries to access business routes, redirect to admin dashboard
    const isBusinessRoute = allowedRoles.includes('BUSINESS_REAL_ESTATE') || allowedRoles.includes('BUSINESS_DELIVERY');
    if (user?.role === 'ADMIN' && isBusinessRoute) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Otherwise redirect to home
    return <Navigate to="/" replace />;
  }

  // Authorized
  return <>{children}</>;
};

export default UserProtectedRoute;