import { toast } from "@/hooks/use-toast";
import { handleError } from "@/lib/utils";
import {
  EditPasswordType,
  SigninSchemaType,
  SignupSchemaType,
} from "@/lib/validation";
import { AUTH_ROUTES } from "@/routes";
import {
  editAccountApi,
  signinApi,
  signoutApi,
  signupApi,
  updatePasswordAccountApi,
} from "@/service/auth.service";
import { getCurrentUserApi } from "@/service/user.service";
import { I_EditUser, T_AuthContext, T_User } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

type T_AuthAction =
  | { type: "PENDING" }
  | { type: "SIGN_IN"; payload: { user: T_User } }
  | { type: "SIGN_UP"; payload: { user: T_User } }
  | { type: "ERROR"; payload: { error: string } }
  | { type: "SIGN_OUT" }
  | { type: "USER_LOADED"; payload: { user: T_User } }
  | { type: "EDIT_USER"; payload: { user: T_User } };
interface I_AuthState {
  user: T_User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<T_AuthContext>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  editUser: async () => {},
  updatePassword: async () => {},
  signin: async () => {},
  signup: async () => {},
  signout: async () => {},
});

const authReducer = (state: I_AuthState, action: T_AuthAction): I_AuthState => {
  switch (action.type) {
    case "PENDING": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "SIGN_IN": {
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    }
    case "SIGN_UP": {
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    }
    case "ERROR": {
      return {
        ...state,
        error: action.payload.error,
        isAuthenticated: false,
        isLoading: false,
      };
    }
    case "SIGN_OUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    }
    case "USER_LOADED": {
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    }
    case "EDIT_USER": {
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload.user } : null,
        isAuthenticated: true,
        isLoading: false,
      };
    }
    default:
      throw new Error("action type not found");
  }
};

const authState: I_AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, authState);

  const navigate = useNavigate();
  const location = useLocation();

  // *************** Signin
  const signin = async (values: SigninSchemaType) => {
    dispatch({ type: "PENDING" });

    try {
      const {
        data: { user, message },
      } = await signinApi(values);

      toast({ title: "Successful", description: message });

      dispatch({ type: "SIGN_IN", payload: { user } });

      const redirectPath = location.state?.from?.pathname || "/";
      navigate(redirectPath);
    } catch (error: unknown) {
      const message = handleError(error);
      dispatch({ type: "ERROR", payload: { error: message } });
      toast({ title: "Failed", description: message });
    }
  };

  // *************** Signup
  const signup = async (values: SignupSchemaType) => {
    dispatch({ type: "PENDING" });
    try {
      const {
        data: { user, message },
      } = await signupApi(values);
      toast({ title: "Successful", description: message });

      dispatch({ type: "SIGN_UP", payload: { user } });
      const redirectPath = location.state?.from?.pathname || "/";

      navigate(redirectPath);
    } catch (error: unknown) {
      const message = handleError(error);
      dispatch({ type: "ERROR", payload: { error: message } });
      toast({ title: "Failed", description: message });
    }
  };

  // *************** Signout
  const signout = async () => {
    dispatch({ type: "PENDING" });
    try {
      await signoutApi();

      dispatch({ type: "SIGN_OUT" });

      navigate("/sign-in");
    } catch (error: unknown) {
      const message = handleError(error);
      dispatch({ type: "ERROR", payload: { error: message } });
      console.log(error);
    }
  };

  // *************** Update user
  const editUser = async (user: I_EditUser) => {
    try {
      const {
        data: { message, data },
      } = await editAccountApi(user);

      dispatch({ type: "EDIT_USER", payload: { user: data } });

      toast({ title: "Success", description: message });
    } catch (error) {
      const message = handleError(error);
      dispatch({ type: "ERROR", payload: { error: message } });
      toast({ title: "Error", description: message });
    }
  };

  // *************** Update user password
  const updatePassword = async (passwordData: EditPasswordType) => {
    try {
      const {
        data: { message },
      } = await updatePasswordAccountApi(passwordData);

      toast({ title: "Successful", description: message });
      await signout();
    } catch (error) {
      const message = handleError(error);
      toast({ title: "Failed", description: message });
    }
  };

  // *************** Get current user
  const getCurrentUser = async () => {
    dispatch({ type: "PENDING" });
    try {
      const {
        data: { user },
      } = await getCurrentUserApi();
      if (!user) {
        navigate(AUTH_ROUTES.SIGN_IN);
        return;
      }

      dispatch({ type: "USER_LOADED", payload: { user } });
    } catch (error: unknown) {
      const message = handleError(error);
      dispatch({ type: "ERROR", payload: { error: message } });
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
      value={{
        ...state,
        editUser,
        updatePassword,
        signin,
        signup,
        signout,
      }}>
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
