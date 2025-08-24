// useAuth.js
import { createContext, useContext } from "react";

const AuthContext = createContext();
export default AuthContext;

// Custom hook
export const useAuth = () => useContext(AuthContext);
