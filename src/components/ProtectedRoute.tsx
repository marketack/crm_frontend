import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // ✅ Use 'requiredRoles', not 'roles'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Ensure user has at least one of the required roles (or allow if no roles are required)
  const hasRequiredRole = requiredRoles ? user?.roles?.some(role => requiredRoles.includes(role)) : true;

  // Redirect if not authenticated or lacks required roles
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
