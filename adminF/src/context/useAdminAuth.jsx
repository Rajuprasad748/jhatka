import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminAuthContext from "./useAuth.js";

axios.defaults.withCredentials = true;

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Login
  const login = async ({ mobile, password }) => {
    try {
      setError(null);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/login`,
        { mobile, password }
      );
      localStorage.setItem("token", res.data.token);
      setAdmin(res.data.admin);
      return res.data.admin;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };
  

  // ✅ Logout (send token header)
  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/logout`,
        {withCredentials:true},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      localStorage.removeItem("token");
      setAdmin(null);
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
    }
  };


  // ✅ Verify (check auth on refresh)
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/verify`,
        {withCredentials:true},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setAdmin(res.data.admin);
    } catch (err) {
      console.log("Auth check failed", err.response?.status, err.response?.data);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
