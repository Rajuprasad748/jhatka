import React, { useState, useEffect } from "react";
import axios from "axios";

const TokenHistory = () => {
  const [tokenHistory, setTokenHistory] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokenHistory();
  }, []);

  const fetchTokenHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/tokenHistory`);
      const addTokens = res.data;

      // Filter only "add" tokens
      const tokens = addTokens.filter((token) => token.type === "add");

      // Group tokens by day (DD/MM/YYYY)
      const grouped = {};
      tokens.forEach((token) => {
        const date = new Date(token.time).toLocaleDateString("en-GB");
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(token);
      });

      setTokenHistory(grouped);
    } catch (error) {
      console.error("Error fetching token history:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const calculateDaySum = (tokens) =>
    tokens.reduce((sum, token) => sum + token.amount, 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Token History</h2>

      {/* Skeleton Loader */}
      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="border rounded-lg shadow">
              <div className="p-3 bg-gray-100">
                <div className="h-4 w-1/3 bg-gray-300 animate-pulse rounded mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      {!loading && Object.keys(tokenHistory).length === 0 && (
        <div className="flex justify-center py-10">
          <img
            src="https://cdn.dribbble.com/users/2131993/screenshots/6007793/no_result.gif"
            alt="No Data"
            className="w-60"
          />
        </div>
      )}

      {!loading &&
        Object.keys(tokenHistory).map((day) => (
          <div key={day} className="mb-4 border rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div
              className="p-3 bg-gray-100 cursor-pointer flex justify-between items-center hover:bg-gray-200 transition"
              onClick={() => toggleDay(day)}
            >
              <span className="font-semibold">{day}</span>
              <span className="text-green-600 font-bold">
                Total Add: {calculateDaySum(tokenHistory[day])}
              </span>
            </div>

            {/* Token List */}
            {expandedDays[day] && (
              <div className="bg-white divide-y">
                {tokenHistory[day].map((token) => (
                  <div
                    key={token._id}
                    className="flex justify-between px-4 py-2 text-sm hover:bg-gray-50 transition"
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
