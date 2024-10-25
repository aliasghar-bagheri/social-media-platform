import SignupForm from "@/forms/auth/SignupForm";
import { useAuth } from "@/context/AuthProvider";
import { MAIN_ROUTES } from "@/routes";
import { Navigate } from "react-router-dom";

const Signup = () => {

  const { user } = useAuth();

  return user ? <Navigate to={MAIN_ROUTES.HOME} /> : <SignupForm />;
};

export default Signup;
