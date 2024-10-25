import { T_AuthContext, T_User } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

const AuthContext = createContext<T_AuthContext>({
  user: null,
  setUser: () => {},
  isAuthentication: false,
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<T_User | null>(null);
  const [isAuthentication, setIsAuthentication] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthentication }}>
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
