import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const PrivateRoute = () => {
  const { user  , loading} = useAuth();

  // If logged in → render nested route
  // If not → redirect to login
  if (loading) return <p>Loading...</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
