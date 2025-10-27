import React, { useEffect, useState } from "react";
import axios from "axios";

const BetHistory = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/betHistory`,
          { withCredentials: true ,
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 sending manually
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

    fetchBets();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // ✅ Skeleton Loader
  const SkeletonItem = () => (
    <div className="border border-gray-700 bg-gray-800 rounded-lg p-4 animate-pulse flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        <div className="h-3 bg-gray-600 rounded w-1/3"></div>
      </div>
      <div className="h-4 w-20 bg-gray-600 rounded self-end sm:self-center"></div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-3 sm:p-6">
    
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <SkeletonItem key={i} />
          ))}
        </div>
      ) : bets.length === 0 ? (
        <p className="text-gray-500 text-center text-sm sm:text-base">
          No bets placed yet
        </p>
      ) : (
        <div className="space-y-3">
          {bets
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((bet, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-gray-800 text-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:shadow-md transition-shadow"
              >
                {/* Left Section */}
                <div className="flex flex-col text-lg sm:text-base">
                  <span className="font-medium text-xl">{bet.gameName}</span>
                  <span className="text-md">{formatDate(bet.createdAt)}</span>
                  <span className="text-md sm:text-sm capitalize">
                    Type: {bet.betType} ({bet.marketType})
                  </span>
                  <span className="text-md sm:text-sm">Digits: {bet.digits}</span>
                </div>

                {/* Right Section */}
                <div className="mt-3 sm:mt-0 text-right text-md sm:text-base space-y-1">
                  <p className="font-semibold text-blue-600">Bet: {bet.points}</p>
                  {bet.winningAmount > 0 && bet.status === "won" && (
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
