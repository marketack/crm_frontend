import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // ✅ Ensure requiredRoles is an array
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // ✅ Ensure user role is checked properly
  const userRole = user?.role || "customer";

  // ✅ If requiredRoles are provided, check if the user has access
  const hasRequiredRole = requiredRoles?.length ? requiredRoles.includes(userRole) : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
