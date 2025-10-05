import React, { useEffect, useState } from "react";
import axios from "axios";

const BetHistory = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/betHistory`,
          { withCredentials: true }
        );
        setBets(res.data);
      } catch (error) {
        console.error("Error fetching bet history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-gray-800">
        Bet History
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : bets.length === 0 ? (
        <p className="text-gray-500 text-center text-sm sm:text-base">
          No bets placed yet
        </p>
      ) : (
        <div className="space-y-3">
          {bets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((bet, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-gray-800 text-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:shadow-md transition-shadow"
            >
              {/* Left Section */}
              <div className="flex flex-col space-y-1 text-lg sm:text-base">
                <span className=" font-medium">
                  🎮 {bet.gameName}
                </span>
                <span className="text-md">
                  {formatDate(bet.createdAt)}
                </span>
                <span className="text-md sm:text-sm capitalize">
                  Type: {bet.betType} ({bet.marketType})
                </span>
                <span className="text-md sm:text-sm ">
                  Digits: {bet.digits}
                </span>
              </div>

              {/* Right Section */}
              <div className="mt-3 sm:mt-0 text-right text-md sm:text-base">
                <p className="font-semibold text-blue-600">
                  Bet: {bet.points}
                </p>
                {bet.winningAmount > 0 && (
                  <p className="font-semibold text-green-600">
                    Won: {bet.winningAmount}
                  </p>
                )}
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-md rounded-full font-medium capitalize
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BetHistory;
