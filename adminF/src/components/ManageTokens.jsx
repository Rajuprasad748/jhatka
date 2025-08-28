import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ManageTokens = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const prevBalanceRef = useRef(0);

  // Counter animation for wallet balance
  useEffect(() => {
    if (user?.walletBalance !== undefined) {
      const start = prevBalanceRef.current || 0;
      const end = user.walletBalance;
      const duration = 1000;
      const startTime = performance.now();

      const animate = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        setAnimatedBalance(Math.floor(start + (end - start) * progress));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      prevBalanceRef.current = end;
    }
  }, [user?.walletBalance]);

  // Fetch user
  const fetchUser = async () => {
    if (!userId) {
      setMessage("Please enter a User ID");
      return;
    }
    try {
      setLoading(true);
      setUser(null);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/findUser/${userId}`);
      setUser(res.data);
      setMessage("");
    } catch (error) {
      setUser(null);
      setMessage(error.response?.data?.message || error.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  // Handle token update (add/remove)
  const handleTokenUpdate = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "add"
          ? `${import.meta.env.VITE_API_BASE_URL}/addTokens/${userId}`
          : `${import.meta.env.VITE_API_BASE_URL}/removeTokens/${userId}`;

      const res = await axios.put(endpoint, { tokens: Number(tokens) });
      setMessage(`Tokens ${activeTab === "add" ? "added" : "removed"} successfully!`);
      setUser(res.data);
      setTokens("");
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Error updating tokens");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg transition-all duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Tokens</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 py-2 rounded-l-lg font-semibold transition-all ${
            activeTab === "add" ? "bg-green-500 text-white scale-105" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Add Tokens
        </button>
        <button
          onClick={() => setActiveTab("remove")}
          className={`flex-1 py-2 rounded-r-lg font-semibold transition-all ${
            activeTab === "remove" ? "bg-red-500 text-white scale-105" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Remove Tokens
        </button>
      </div>

      {/* User ID */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Enter User ID"
        />
        <button
          onClick={fetchUser}
          disabled={loading}
          className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? "Fetching..." : "Fetch User"}
        </button>
      </div>

      {/* User Info with animation */}
      {loading && !user && (
        <div className="animate-pulse p-4 rounded-lg bg-gray-100 mb-6">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      )}

      {user && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-inner transition-all">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p>
            <strong>Wallet Balance:</strong>{" "}
            <span className="text-green-600 font-bold text-lg">{animatedBalance}</span>
          </p>
        </div>
      )}

      {/* Tokens input */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          {activeTab === "add" ? "Tokens to Add" : "Tokens to Remove"}
        </label>
        <input
          type="number"
          value={tokens}
          onChange={(e) => setTokens(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          placeholder={`Enter tokens to ${activeTab}`}
        />
      </div>

      {/* Action button */}
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={loading || !tokens}
        className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${
          activeTab === "add"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        } disabled:bg-gray-400`}
      >
        {loading ? "Processing..." : activeTab === "add" ? "Add Tokens" : "Remove Tokens"}
      </button>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 transform scale-95 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-center">Confirm Action</h3>
            <p className="mb-6 text-center text-gray-700">
              Are you sure you want to {activeTab} <strong>{tokens}</strong> tokens?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleTokenUpdate}
                className={`px-5 py-2 rounded-lg text-white ${
                  activeTab === "add" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <p
          className={`mt-6 text-center font-medium ${
            message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ManageTokens;
