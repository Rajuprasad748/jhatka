import { useState } from "react";
import axios from "axios";
import { Link , useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // 'email' -> 'otp' -> 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ Step 1: Send OTP to email
  const handleSendOtp = async () => {
    if (!email) return setMessage("Please enter your email");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/sendOtp`,
        { email }
      );
      setMessage(res.data.message || "OTP sent successfully!");

      sessionStorage.setItem("otp", res.data.otp); // only for demo — in real backend you won’t store OTP on client
      setStep("otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = () => {
    const serverOtp = sessionStorage.getItem("otp"); // only for demo
    if (otp === serverOtp) {
      setMessage("OTP verified successfully!");
      setStep("reset");
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  // ✅ Step 3: Update Password
  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/reset-password`,
        {
          email,
          password,
        }
      );
      setMessage(res.data.message || "Password updated successfully!");
      sessionStorage.removeItem("otp");
      navigate("/login");
      setStep("done");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === "email" && "Forgot Password"}
          {step === "otp" && "Verify OTP"}
          {step === "reset" && "Reset Password"}
          {step === "done" && "Success!"}
        </h2>

        {message && <p className="text-sm text-blue-600 mb-3">{message}</p>}

        {/* Step 1: Email Input */}
        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />
            <button
              onClick={handleSendOtp}
              className="bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-green-600 text-white py-2 px-4 w-full rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />
            <button
              onClick={handleResetPassword}
              className="bg-purple-600 text-white py-2 px-4 w-full rounded hover:bg-purple-700"
            >
              Update Password
            </button>
          </>
        )}

        {step === "done" && (
          <p className="text-green-700 text-center font-semibold">
            Password successfully updated! You can now log in.
          </p>
        )}

        <div className="my-4 text-red-500 font-medium">
          <p>📍Please Do not refresh the page or navigate away.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
