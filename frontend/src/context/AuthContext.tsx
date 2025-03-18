import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string | null, isAdmin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(
    localStorage.getItem("isAdmin") === "true"
  );

  const setToken = (token: string | null, isAdmin: boolean) => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", String(isAdmin));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    }
    setTokenState(token);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setTokenState(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
