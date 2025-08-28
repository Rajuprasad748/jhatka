//RemoveToken.jsx

import React, { useState } from "react";
import axios from "axios";

const RemoveToken = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState("");
  const [message, setMessage] = useState("");

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

  // Remove tokens from wallet
  const handleRemoveTokens = async () => {
    if (!tokens || isNaN(tokens)) {
      setMessage("Please enter a valid number of tokens");
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/removeTokens/${userId}`,
        {
          tokens: Number(tokens),
        }
      );
      setUser(res.data);
      setTokens("");
      setMessage("Tokens removed successfully!");
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
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Contact:</strong> {user.mobile}</p>
          <p><strong>Wallet Balance:</strong> {user.walletBalance}</p>
        </div>
      )}

      {/* Remove tokens input */}
      {user && (
        <>
          <input
            type="number"
            placeholder="Enter tokens to remove"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-lg"
          />
          <button
            onClick={handleRemoveTokens}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Remove Tokens
          </button>
        </>
      )}

      {/* Message */}
      {message && (
        <p className="mt-4 text-center text-sm font-medium text-red-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default RemoveToken;

