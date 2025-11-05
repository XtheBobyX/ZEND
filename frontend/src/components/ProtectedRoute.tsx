import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
