import React, { useEffect, useState } from "react";
import axios from "axios";

const TokenHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/tokenHistory`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data); // assuming backend returns [{ remark, amount, type, createdAt }]
      } catch (error) {
        console.error("Error fetching token history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ✅ Skeleton Loader Component
  const SkeletonItem = () => (
    <div className="flex justify-between items-start bg-slate-700 p-4 rounded-xl animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-slate-600 rounded"></div>
        <div className="h-3 w-20 bg-slate-600 rounded"></div>
      </div>
      <div className="h-5 w-10 bg-slate-600 rounded"></div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto rounded-xl shadow p-4 mt-8">
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <SkeletonItem key={i} />
          ))}
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray-500 text-center">No history available</p>
      ) : (
        <div className="space-y-1">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-white items-start bg-slate-700 p-4 rounded-xl border-b pb-2 last:border-none"
            >
              <div>
                <span className="block font-bold">{item.remark}</span>
                <span className="text-sm">{formatDate(item.createdAt)}</span>
              </div>

              <span
                className={`font-bold text-lg ${
                  item.type === "add" ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.type === "add" ? "+" : "-"}
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenHistory;
