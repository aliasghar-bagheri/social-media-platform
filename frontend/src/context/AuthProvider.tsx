import { toast } from "@/hooks/use-toast";
import { handleError } from "@/lib/utils";
import { SigninSchemaType, SignupSchemaType } from "@/lib/validation";
import { signinApi, signoutApi, signupApi } from "@/service/auth.service";
import { getCurrentUserApi } from "@/service/user.service";
import { T_AuthContext, T_User } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext<T_AuthContext>({
  user: null,
  setUser: () => {},
  isAuthentication: false,
  signin: async () => {},
  signup: async () => {},
  signout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<T_User | null>(null);
  const [isAuthentication, setIsAuthentication] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // *************** Signin
  const signin = async (values: SigninSchemaType) => {
    try {
      const {
        data: { user, message },
      } = await signinApi(values);
      toast({ title: "Successful", description: message });
      setUser(user);

      const redirectPath = location.state?.from?.pathname || "/";

      navigate(redirectPath);
    } catch (error: unknown) {
      const message = handleError(error);
      toast({ title: "Failed", description: message });
    }
  };

  // *************** Signup
  const signup = async (values: SignupSchemaType) => {
    try {
      const {
        data: { user, message },
      } = await signupApi(values);
      toast({ title: "Successful", description: message });
      setUser(user);
      const redirectPath = location.state?.from?.pathname || "/";

      navigate(redirectPath);
    } catch (error: unknown) {
      const message = handleError(error);
      toast({ title: "Failed", description: message });
    }
  };

  // *************** Signout
  const signout = async () => {
    try {
      await signoutApi();
      setUser(null);
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  // *************** Get current user
  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await getCurrentUserApi();

      setUser(user);
      setIsAuthentication(true);
    } catch (error) {
      setUser(null);
      setIsAuthentication(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCurrentUser();
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthentication, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a an AuthProvider");
  }

  return context;
};
