import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
  redirectTo?: string;
}

function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
