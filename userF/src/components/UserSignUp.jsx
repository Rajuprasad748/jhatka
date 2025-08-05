import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserSignUp = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isFormValid =
    name.trim() !== "" &&
    mobile.length === 10 &&
    password.trim() !== "" &&
    otp.every((digit) => digit !== "");

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setIsOtpSent(true);
    toast.success("OTP sent successfully");
    // Place OTP sending backend logic here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", {
        name,
        mobile,
        password,
        otp: otp.join(""),
      });

      console.log(response)
      setName("");
      setMobile("");
      setPassword("");
      setOtp(["", "", "", ""]);
      setIsOtpSent(false);

      navigate("/");
      toast.success("Registration successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-300 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-2 sm:p-10 md:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-6 text-center">
          Create an Account
        </h2>

        <form className="space-y-2" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Mobile + Verify */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="tel"
                placeholder="10-digit mobile"
                className="flex-1 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                value={mobile}
                onChange={(e) => {
                  if (/^\d{0,10}$/.test(e.target.value)) setMobile(e.target.value);
                }}
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {isOtpSent ? "Resend OTP" : "Verify"}
              </button>
            </div>
          </div>

          {/* OTP Boxes */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Enter OTP</label>
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 sm:w-14 sm:h-14 text-center border rounded-md text-xl focus:ring-2 focus:ring-blue-400"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  required
                />
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`h-12 rounded-lg w-full font-medium text-base transition ${
              isFormValid
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
