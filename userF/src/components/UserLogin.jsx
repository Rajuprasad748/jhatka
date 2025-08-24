// UserLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth"; // ✅ use context

const UserLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // ✅ Call context login (this updates AuthProvider state)
      await login({ mobile, password });

      setMobile("");
      setPassword("");
      toast.success("Logged in successfully!");

      // redirect after login
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
          Login to Your Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Mobile */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Mobile
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 h-12 focus-within:border-blue-500 transition-all">
              <input
                type="tel"
                placeholder="Enter your Mobile Number"
                className="ml-2 w-full h-full border-none outline-none bg-transparent text-base"
                value={mobile}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setMobile(onlyNums);
                }}
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 h-12 focus-within:border-blue-500 transition-all">
              <input
                type="password"
                placeholder="Enter your Password"
                className="ml-2 w-full h-full border-none outline-none bg-transparent text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Forgot password link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="bg-black text-white font-medium text-base h-12 rounded-lg w-full mt-3 hover:bg-gray-800 transition"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
