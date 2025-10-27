import React, { useEffect, useState } from "react";
import axios from "axios";

// 🔹 Skeleton card for loading
const WalletSkeleton = () => (
  <div className="animate-pulse bg-gray-200 rounded-xl p-4 mb-3">
    <div className="h-5 w-1/3 bg-gray-300 rounded mb-2"></div>
    <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
    <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
  </div>
);

const Wallet = () => {
  const [walletHistory, setWalletHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/walletHistory`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const { tokenHistory = [], winningHistory = [] } = res.data;

        // Normalize token history
        const normalizedTokenHistory = tokenHistory.map((item) => ({
          type: item.type,
          amount: item.amount,
          message: item.remark,
          date: item.createdAt,
        }));

        // Normalize winning history
        const normalizedWinningHistory = winningHistory
          .filter((item) => item.status === "won")
          .map((item) => ({
            type: "win",
            amount: item.winningAmount,
            message: `Won ₹${item.winningAmount} in ${item.gameName.toUpperCase()} (${item.marketType})`,
            date: item.createdAt,
          }));

        // Combine & sort ascending for running total
        const combined = [...normalizedTokenHistory, ...normalizedWinningHistory];
        combined.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate running balance
        let balance = 0;
        const withBalance = combined.map((item) => {
          if (item.type === "add" || item.type === "win") balance += item.amount;
          else if (item.type === "remove") balance -= item.amount;
          return { ...item, balance };
        });

        // Reverse for newest first
        withBalance.reverse();

        setWalletHistory(withBalance);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Wallet History
        </h1>

        {loading ? (
          <div>
            {[...Array(6)].map((_, i) => (
              <WalletSkeleton key={i} />
            ))}
          </div>
        ) : walletHistory.length === 0 ? (
          <p className="text-center text-gray-500">
            No wallet transactions found.
          </p>
        ) : (
          <div className="space-y-3">
            {walletHistory.map((item, index) => (
              <div
                key={index}
                className={`flex flex-row justify-between items-start sm:items-center p-4 rounded-xl shadow-md space-y-2 sm:space-y-0 ${
                  item.type === "add"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : item.type === "win"
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-red-50 border-l-4 border-red-500"
                }`}
              >
                <div className="flex-1">
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">
                    {item.type === "add"
                      ? "Token Added"
                      : item.type === "win"
                      ? "Winning Amount"
                      : "Tokens Removed"}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm">{item.message}</p>
                  <p className="text-gray-700 text-xs">
                    {new Date(item.date).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end space-y-1 sm:space-y-0 sm:space-x-0">
                  <span
                    className={`font-bold text-lg ${
                      item.type === "remove" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {item.type === "remove"
                      ? `-₹${item.amount}`
                      : `+₹${item.amount}`}
                  </span>
                  <span className="text-gray-800 font-semibold text-sm sm:text-base">
                    Balance: ₹{item.balance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
