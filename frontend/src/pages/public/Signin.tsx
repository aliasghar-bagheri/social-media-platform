import SigninForm from "@/forms/auth/SigninForm";
import { useAuth } from "@/context/AuthProvider";
import { MAIN_ROUTES } from "@/routes";
import { Navigate } from "react-router-dom";

const Signin = () => {
  const { user } = useAuth();

  return user ? <Navigate to={MAIN_ROUTES.HOME} /> : <SigninForm />;
};

export default Signin;
