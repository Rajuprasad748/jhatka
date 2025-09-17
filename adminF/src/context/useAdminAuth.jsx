import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminAuthContext from "./useAuth.js";

// ✅ Set axios defaults (URL from env + cookies enabled)
axios.defaults.withCredentials = true; // send/receive cookies

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // for initial check
  const [error, setError] = useState(null);

  // ✅ Login
  const login = async ({ mobile, password }) => {
    try {
      setError(null);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, { mobile, password });
      setAdmin(res.data.admin);
      console.log("auth admin" , res.data.admin)
      return res.data.admin;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/logout`);
      setAdmin(null);
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
    }
  };

  // ✅ Check current session on refresh
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/verify` , {
        withCredentials: true
      });
      setAdmin(res.data.admin);
    } catch (err) {
      setAdmin(null);
      console.log("object" , err)
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
