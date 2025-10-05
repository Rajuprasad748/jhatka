import { useState, useEffect } from "react";
import AuthContext from "./useAuth";
import axios from "axios";

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token"); // 🧠 Get token from localStorage
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/verify`,
        {
          withCredentials: true,
          headers,
        }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    const interval = setInterval(fetchUser, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = async (credentials) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/login`,
      credentials,
      { withCredentials: true }
    );

    // ✅ store token manually for Safari/iOS
    localStorage.setItem("token", res.data.token);

    await fetchUser();
  };

  const logout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("token"); // remove manually stored token
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, updateUser, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
