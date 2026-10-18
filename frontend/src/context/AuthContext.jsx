import { createContext, useCallback, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshUser = useCallback(async () => {
    setLoading(true);


    try {
      const { data } = await API.get("/auth/me");
      setUser(data.user);
      setError("");
      return data.user;


    } catch (requestError) {
      if (requestError.response?.status === 401) {
        setUser(null);
        setError("");
        return null;
      }


      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to verify your login."
      );

      throw requestError;


    } finally {
      setLoading(false);
    }

    
  }, []);

  useEffect(() => {

    refreshUser().catch(() => {
      // The error is stored in context and shown by the relevant screen.
    });
  }, [refreshUser]);

  const logout = useCallback(async () => {
    setError("");
    try {
      await API.post("/auth/logout");
      setUser(null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to log out."
      );
      throw requestError;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
