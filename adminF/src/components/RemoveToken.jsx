// RemoveToken.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const RemoveToken = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState("");
  const [remark, setRemark] = useState("Tokens removed successfully!"); // ✅ new state
  const [message, setMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  const prevBalanceRef = useRef(0);

  // Animate wallet balance when user.walletBalance changes
  useEffect(() => {
    if (user?.walletBalance !== undefined) {
      const start = prevBalanceRef.current || 0;
      const end = user.walletBalance;
      const duration = 800; // ms
      const startTime = performance.now();

      const animate = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentValue = Math.floor(start + (end - start) * progress);
        setAnimatedBalance(currentValue);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      prevBalanceRef.current = end;
    }
  }, [user?.walletBalance]);

  // Fetch user by ID
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/findUser/${userId}`
      );
      setUser(res.data);
      setMessage("");
    } catch (error) {
      setUser(null);
      setMessage(error.message || "Error fetching user");
    }
  };

  // Remove tokens from wallet (after confirmation)
  const handleRemoveTokens = async () => {
    if (!tokens || isNaN(tokens)) {
      setMessage("Please enter a valid number of tokens");
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/removeTokens/${userId}`,
        { tokens: Number(tokens), remark } // ✅ sending remark
      );
      setUser(res.data);
      setTokens("");
      setRemark("Tokens removed successfully!"); // ✅ reset default
      setMessage("Tokens removed successfully!");
      setConfirmDialog(false); // close dialog
    } catch (error) {
      setMessage(error.message || "Error removing tokens");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Remove Tokens</h2>

      {/* User ID input */}
      <input
        type="text"
        placeholder="Enter the User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full px-4 py-2 mb-2 border rounded-lg"
      />
      <button
        onClick={fetchUser}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition"
      >
        Fetch User
      </button>

      {/* Show user details */}
      {user && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm sm:text-base">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Contact:</strong> {user.mobile}
          </p>
          <p>
            <strong>Wallet Balance:</strong>{" "}
            <span className="font-bold text-green-600">{animatedBalance}</span>
          </p>
        </div>
      )}

      {/* Remark + Remove tokens input */}
      {user && (
        <>
          {/* Remark textarea (responsive + fixed length) */}
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            maxLength={100} // ✅ limit characters
            rows={2} // ✅ responsive-friendly height
            className="w-full px-4 py-2 mb-2 border rounded-lg resize-none"
            placeholder="Enter remark"
          />
        
          {/* Tokens input */}
          <input
            type="number"
            placeholder="Enter tokens to remove"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-lg"
          />
          <button
            onClick={() => setConfirmDialog(true)}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Remove Tokens
          </button>
        </>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Confirm Removal
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to remove{" "}
              <strong>{tokens}</strong> tokens from{" "}
              <span className="font-semibold">{user?.name}</span>'s wallet?
            </p>
            <p className="text-gray-500 text-center mb-6">
              <strong>Remark:</strong> {remark}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRemoveTokens}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setConfirmDialog(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
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

export default RemoveToken;
