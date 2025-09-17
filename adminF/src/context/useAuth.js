// useAuth.js
import { createContext, useContext } from "react";

const AdminAuthContext = createContext();
export default AdminAuthContext;

// Custom hook
export const useAdminAuth = () => useContext(AdminAuthContext);