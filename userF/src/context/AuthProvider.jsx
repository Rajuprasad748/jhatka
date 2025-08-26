import { useState, useEffect } from "react";
import AuthContext from "./useAuth";
import axios from "axios";

axios.defaults.withCredentials = true; // allow cookies

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/verify`
      );
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/login`,
      credentials,
      {
        withCredentials: true,
      }
    );
    await fetchUser();
  };

  const logout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    setUser(null);
  };

  // 🔥 new helper to update user state manually
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
