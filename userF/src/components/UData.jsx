import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UData = () => {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch games function (memoized for refresh)
  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/games`
      );
      setGameData(data);
    } catch (err) {
      console.error("Error fetching games:", err);
      setGameData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh every 15 seconds
  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 15000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  // Helper to get last digit of sum
  const getLastDigitOfSum = (digits) => {
    if (!Array.isArray(digits)) return "";
    const total = digits.reduce((sum, num) => sum + Number(num || 0), 0);
    return String(total).slice(-1); // last digit
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header with Refresh Button */}
      <header className="sticky top-0 z-10 bg-gray-800 p-4 shadow text-center text-xl sm:text-2xl font-bold text-yellow-400 border-b border-gray-700 flex items-center justify-center gap-4">
        <span>MAIN RESULT</span>
        <button
          onClick={fetchGames}
          className="ml-4 flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm transition"
        >
          Refresh
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-3 py-6 space-y-5">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          gameData.map((item                                                                                                                                                     ) => {
            const openDigitsStr = item.openDigits?.join("") || "";
            const closeDigitsStr = item.closeDigits?.join("") || "";
            const midDigits =
              getLastDigitOfSum(item.openDigits) +
              getLastDigitOfSum(item.closeDigits);

            return (
              <div
                key={item._id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md space-y-3"
              >
                {/* Time Row */}
                <div className="text-xs sm:text-sm text-center text-gray-400">
                  Open: {item.openingTime} | Close: {item.closingTime}
                </div>

                {/* Left Icon + Name + Digits + Right Icon */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left Link */}
                  <Link
                    to={`/game/${item.name.replace(/\s+/g, "-").toLowerCase()}`}
                    className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-lg hover:bg-yellow-300 transition flex-shrink-0"
                  >
                    🏺
                  </Link>

                  {/* Game Name + Digits */}
                  <div className="flex-1 text-center">
                    <p className="text-sm sm:text-lg font-semibold">{item.name}</p>
                    <p className="text-yellow-400 text-lg">
                      {openDigitsStr}-{midDigits}-{closeDigitsStr}
                    </p>
                  </div>

                  {/* Right Link */}
                  <Link
                    to={`/game/${item.name.replace(/\s+/g, "-").toLowerCase()}`}
                    className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-lg hover:bg-yellow-300 transition flex-shrink-0"
                  >
                    🏺
                  </Link>
                </div>

                {/* Status */}
                <div className="text-center text-xs sm:text-sm font-semibold text-red-500">
                  Close for today
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default UData;