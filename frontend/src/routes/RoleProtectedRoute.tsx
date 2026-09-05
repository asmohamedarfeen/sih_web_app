import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, getRoleDashboardRoute } from '../store/authStore';
import { UserRole } from '../types/auth';

interface RoleProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect user to their own role dashboard if unauthorized for this specific view
    const authorizedRoute = getRoleDashboardRoute(user.role);
    return <Navigate to={authorizedRoute} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
