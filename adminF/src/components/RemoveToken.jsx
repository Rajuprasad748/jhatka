import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RemoveToken = () => {
  const [mobile, setMobile] = useState("");
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState("");
  const [remark, setRemark] = useState("Tokens removed successfully!");
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  const prevBalanceRef = useRef(0);

  // Animate wallet balance
  useEffect(() => {
    if (user?.walletBalance !== undefined) {
      const start = prevBalanceRef.current || 0;
      const end = user.walletBalance;
      const duration = 800;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentValue = Math.floor(start + (end - start) * progress);
        setAnimatedBalance(currentValue);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      prevBalanceRef.current = end;
    }
  }, [user?.walletBalance]);

  // Fetch user by mobile
  const fetchUser = async () => {
    if (!mobile) {
      toast.error("Please enter a mobile number");
      return;
    }

    // // Validate mobile
    // if (!/^[6-9]\d{9}$/.test(mobile)) {
    //   toast.error("Enter a valid 10-digit mobile number");
    //   return;
    // }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/findUser/${mobile}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      toast.success("User found successfully!");
    } catch (error) {
      setUser(null);
      toast.error(
        error.response?.data?.message || error.message || "Error fetching user"
      );
    } finally {
      setLoading(false);
    }
  };

  // Remove tokens with remark
  const handleRemoveTokens = async () => {
    if (isSubmitting) return; // Prevent double click
    if (!tokens || isNaN(tokens)) {
      toast.error("Please enter a valid number of tokens");
      return;
    }
    if (Number(tokens) <= 0) {
      toast.error("Tokens must be greater than zero");
      return;
    }
    if (!user) {
      toast.error("Please fetch a user first.");
      return;
    }

    setLoading(true);
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin/removeTokens/${mobile}`,
        { tokens: Number(tokens), remark },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      setTokens("");
      setRemark("Tokens removed successfully!");
      toast.success("Tokens removed successfully!");
      setConfirmDialog(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error removing tokens"
      );
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
        Remove Tokens
      </h2>

      {/* Mobile input */}
      <input
        type="text"
        placeholder="Enter the Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchUser()}
        className="w-full px-4 py-2 mb-2 border rounded-lg"
        disabled={loading}
      />
      <button
        onClick={fetchUser}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Fetching..." : "Fetch User"}
      </button>

      {/* Show user details */}
      {user && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Contact:</strong> {user.mobile}</p>
          <p>
            <strong>Wallet Balance:</strong>{" "}
            <span className="font-bold text-green-600">{animatedBalance}</span>
          </p>
        </div>
      )}

      {/* Remark + Remove tokens input */}
      {user && (
        <>
          <textarea
            placeholder="Enter remark"
            value={remark}
            maxLength={100}
            onChange={(e) => setRemark(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 mb-2 border rounded-lg resize-none"
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Enter tokens to remove"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setConfirmDialog(true)}
            className="w-full px-4 py-2 mb-2 border rounded-lg"
            disabled={loading}
          />
          <button
            onClick={() => setConfirmDialog(true)}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Remove Tokens"}
          </button>
        </>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 px-12 rounded-lg shadow-lg w-100">
            <h3 className="text-xl font-semibold mb-4 text-center">Confirm Removal</h3>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Do you really want to remove{" "}
              <strong>{tokens}</strong> tokens from {user?.name}'s wallet?
            </p>
            <p className="text-md text-gray-500 mb-6 text-center">
              <strong>Remark:</strong> {remark}
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleRemoveTokens}
                disabled={isSubmitting}
                className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Processing..." : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDialog(false)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveToken;
