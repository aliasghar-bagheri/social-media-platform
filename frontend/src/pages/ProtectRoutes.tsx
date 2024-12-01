import { useAuth } from "@/context/AuthProvider";
import { AUTH_ROUTES } from "@/routes";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  return user === null ? (
    <Navigate to={AUTH_ROUTES.SIGN_IN} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default ProtectRoutes;
