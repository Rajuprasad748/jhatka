import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminAuth } from "../context/useAuth.js"; // ✅ admin context

const LoginForm = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ mobile, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-200 px-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg bg-white">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6 text-center">
          Admin Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Mobile */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Mobile
            </label>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              className="w-full border px-3 h-12 rounded-lg"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border px-3 h-12 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            className="bg-black text-white font-medium h-12 rounded-lg hover:bg-gray-800 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
