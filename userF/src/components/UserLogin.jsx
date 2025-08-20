import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        {
          mobile,
          password,
        },{ withCredentials: true }
      );

      // Success → clear fields + navigate
      setMobile("");
      setPassword("");
      toast.success("Logged in successfully!");
      console.log("Login successful:", response.data);

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm5 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
              <input
                type="tel"
                placeholder="Enter your Mobile Number"
                className="ml-2 w-full h-full border-none outline-none bg-transparent text-base"
                value={mobile}
                onChange={(e) => {
                  // Only allow digits
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setMobile(onlyNums);
                }}
                maxLength={10} // optional: restrict to 10 digits
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                viewBox="-64 0 512 512"
                fill="currentColor"
              >
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
              </svg>
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
