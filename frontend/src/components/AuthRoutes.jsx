import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthLoading = () => (
  <main className="auth-loading" role="status">
    Checking your login...
  </main>
);

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoading />;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export const RequireGuest = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (user) return <Navigate to="/work" replace />;

  return children;
};
