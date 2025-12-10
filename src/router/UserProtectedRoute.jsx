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

  // Logged in but with wrong role → go home (or a 403 page)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return <>{children}</>;
};

export default UserProtectedRoute;