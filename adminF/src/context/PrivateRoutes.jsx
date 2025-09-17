import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "./useAuth";

const PrivateRoute = () => {
  const { admin  , loading} = useAdminAuth();

  // If logged in → render nested route
  // If not → redirect to login
  if (loading) return <p>Loading...</p>;
  return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
