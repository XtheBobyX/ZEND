import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (children.type.name === "Register") {
      return;
    }
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
