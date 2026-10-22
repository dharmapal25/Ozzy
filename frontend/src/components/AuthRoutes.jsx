import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PulseLoader } from "react-spinners";
import { LoadingComponent } from "./LoadingComponent";


export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingComponent/> ;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export const RequireGuest = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingComponent/> ;
  if (user) return <Navigate to="/work" replace />;

  return children;
};
