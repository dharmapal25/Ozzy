import { createContext, useCallback, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    API.get("/auth/me")
      .then(({ data }) => {
        if (!isActive) return;
        setUser(data.user);
        setError("");
      })
      .catch((requestError) => {
        if (!isActive) return;
        if (requestError.response?.status === 401) {
          setUser(null);
          setError("");
          return;
        }

        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to verify your login."
        );
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

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
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Keep the hook beside its provider so the context remains a single file.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
