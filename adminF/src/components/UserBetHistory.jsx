import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserBetHistory = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { userId } = location.state || {};

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = localStorage.getItem("token");
      if(!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      };
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/userBetHistory?userId=${userId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBets(res.data);
      } catch (error) {
        console.error("Error fetching bet history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBets();
  }, [userId]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // Skeleton Loader for Table
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-600 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
        User Bet History
      </h2>

      {loading ? (
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-sm font-medium">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Digits</th>
              <th className="px-4 py-3">Bet Points</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      ) : bets.length === 0 ? (
        <p className="text-gray-500 text-center text-base mt-6">
          No bets placed yet
        </p>
      ) : (
        <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white uppercase text-sm font-medium">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Digits</th>
              <th className="px-4 py-3">Bet Points</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bets
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((bet, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b text-white
                  border-gray-300 dark:border-gray-700 justify-center items-center text-center"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{bet.gameName}</td>
                  <td className="px-4 py-3">{formatDate(bet.createdAt)}</td>
                  <td className="px-4 py-3 capitalize">
                    {bet.betType} ({bet.marketType})
                  </td>
                  <td className="px-4 py-3">{bet.digits}</td>
                  <td className="px-4 py-3 text-blue-600 font-semibold">
                    {bet.points}
                  </td>
                  <td className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1">
                    {bet.winningAmount > 0 && (
                      <span className="text-green-600 font-semibold text-sm">
                        Won: {bet.winningAmount}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full flex justify-center items-center text-xs font-medium
                        ${
                          bet.status === "won"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : bet.status === "lost"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                    >
                      {bet.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserBetHistory;
