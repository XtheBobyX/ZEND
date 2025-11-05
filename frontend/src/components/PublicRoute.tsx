import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const PublicRoute = ({ children }) => {
  const { usuario } = useAuth();

  if (usuario) {
    if (children.type.name === "Register") {
      return;
    }
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
