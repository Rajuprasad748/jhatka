import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddToken = () => {
  const [mobile, setMobile] = useState(""); // ✅ changed from userId → mobile
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState("");
  const [remark, setRemark] = useState("Tokens added successfully!");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
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
      setMessage("Please enter a mobile number");
      return;
    }
    setLoading(true);
    try {
      console.log(" searching for mobile:", mobile);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/findUser/${mobile}` // ✅ new endpoint
      );
      console.log(res.data)
      setUser(res.data);
      setMessage("");
    } catch (error) {
      setUser(null);
      setMessage(error.response?.data?.message || error.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  // Add tokens with remark
  const handleAddTokens = async () => {
    if (!tokens || isNaN(tokens)) {
      setMessage("Please enter a valid number of tokens");
      return;
    }
    if (!user) {
      setMessage("Please fetch a user first.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/addTokens/${mobile}`, // ✅ new endpoint
        { tokens: Number(tokens), remark }
      );
      setUser(res.data);
      setTokens("");
      setRemark("Tokens added successfully!");
      setMessage("Tokens added successfully!");
      setConfirmDialog(false);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Error adding tokens");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Tokens</h2>

      {/* Mobile input */}
      <input
        type="text"
        placeholder="Enter the Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchUser()}
        className="w-full px-4 py-2 mb-2 border rounded-lg"
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

      {/* Remark + Add tokens input */}
      {user && (
        <>
          <textarea
            placeholder="Enter remark"
            value={remark}
            maxLength={100}
            onChange={(e) => setRemark(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 mb-2 border rounded-lg resize-none"
          />
          <input
            type="number"
            placeholder="Enter tokens to add"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-lg"
          />
          <button
            onClick={() => setConfirmDialog(true)}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Add Tokens"}
          </button>
        </>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 px-12 rounded-lg shadow-lg w-100">
            <h3 className="text-xl font-semibold mb-4 text-center">Are you sure?</h3>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Do you really want to add <strong>{tokens}</strong> tokens to {user?.name}'s wallet?
            </p>
            <p className="text-md text-gray-500 mb-6 text-center">
              <strong>Remark:</strong> {remark}
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleAddTokens}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDialog(false)}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
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
          className={`mt-4 text-center text-sm font-medium ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddToken;
