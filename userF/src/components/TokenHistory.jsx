import React, { useEffect, useState } from "react";
import axios from "axios";

const TokenHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/tokenHistory`,
          { withCredentials: true }
        );
        setHistory(res.data); // ✅ assuming backend returns an array of { remark, amount, type, createdAt }
      } catch (error) {
        console.error("Error fetching token history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ✅ Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-200 rounded-xl shadow p-4 mt-8">
      <h2 className="text-lg font-semibold mb-3">Token History</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500 text-center">No history available</p>
      ) : (
        <div className="space-y-1">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-white items-start bg-slate-700 p-4 rounded-xl border-b  pb-2 last:border-none"
            >
              {/* Left side: Remark + Date */}
              <div>
                <span className="block ">{item.remark}</span>
                <span className="text-xs">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              {/* Right side: Amount */}
              <span
                className={`font-semibold ${
                  item.type === "add" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.type === "add" ? "+" : "-"}₹{item.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenHistory;
