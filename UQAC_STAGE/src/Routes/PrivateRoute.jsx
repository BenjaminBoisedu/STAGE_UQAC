import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Remplacez cette condition par votre logique d'authentification réelle
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
