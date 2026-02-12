import { createContext, useContext, useEffect, useState } from "react";
import { getUserByID, parseJwt } from "../utils/functions";

interface AuthContextType {
  user: any | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: any;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = parseJwt(token);
    const now = Date.now() / 1000;

    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    try {
      const fetchedUser = await getUserByID(payload.user_id);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to consume auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }

  return context;
};
