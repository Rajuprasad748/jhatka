import React, { useState, useEffect } from "react";
import axios from "axios";

const TokenHistory = () => {
  const [tokenHistory, setTokenHistory] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  useEffect(() => {
    fetchTokenHistory();
  }, []);

  const fetchTokenHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tokenHistory`);
      const addTokens = res.data;

      // Filter only "add" tokens
      const tokens = addTokens.filter((token) => token.type === "add");

      // Group tokens by day (DD//MM//YYYY)
      const grouped = {};
      tokens.forEach((token) => {
        const date = new Date(token.time).toLocaleDateString("en-GB"); // dd/mm/yyyy
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(token);
      });

      setTokenHistory(grouped);
    } catch (error) {
      console.error("Error fetching token history:", error);
    }
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Calculate sum of "add" tokens for a given day
  const calculateDaySum = (tokens) =>
    tokens.reduce((sum, token) => sum + token.amount, 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Token History</h2>
      {Object.keys(tokenHistory).map((day) => (
        <div key={day} className="mb-4 border rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div
            className="p-3 bg-gray-100 cursor-pointer flex justify-between items-center"
            onClick={() => toggleDay(day)}
          >
            <span className="font-semibold">{day}</span>
            <span className="text-green-600 font-bold">
              Total Add: {calculateDaySum(tokenHistory[day])}
            </span>
          </div>

          {/* Dropdown (no animation) */}
          {expandedDays[day] && (
            <div className="bg-white">
              {tokenHistory[day].map((token) => (
                <div
                  key={token._id}
                  className="flex justify-between border-b px-4 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{token.userId?._id}</span> -{" "}
                    <span className="font-medium">{token.userId?.name}</span>{" "}
                    ({token.userId?.mobile})
                  </span>
                  <span className="text-green-600 font-semibold">
                    +{token.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TokenHistory;
