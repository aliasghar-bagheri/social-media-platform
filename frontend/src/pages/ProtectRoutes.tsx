import { useAuth } from "@/context/AuthProvider";
import { AUTH_ROUTES } from "@/routes";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const location = useLocation();

  return !isLoading && !isAuthenticated ? (
    <Navigate to={AUTH_ROUTES.SIGN_IN} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default ProtectRoutes;
