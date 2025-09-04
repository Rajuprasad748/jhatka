import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UData = () => {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch games from backend
  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/games`);
      setGameData(data);
    } catch (err) {
      console.error("Error fetching games:", err);
      setGameData([]);
      setError("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 15000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  // Helper: last digit of sum
  const getLastDigitOfSum = (digits) => {
    if (!Array.isArray(digits)) return "";
    const total = digits.reduce((sum, num) => sum + Number(num || 0), 0);
    return String(total).slice(-1);
  };

  // Check if betting is closed based on closingTime
  const isBetClosed = (closingTime) => {
  if (!closingTime) return false;

  const now = new Date();

  // Split time and period (AM/PM)
  const [time, period] = closingTime.split(" "); // e.g., ["11:00", "PM"]
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Create a Date object for today’s closing time
  const closeDate = new Date();
  closeDate.setHours(hours, minutes, 0, 0);

  return now >= closeDate;
};


  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800 p-4 shadow text-center text-lg sm:text-2xl font-bold text-yellow-400 border-b border-gray-700 flex items-center justify-center gap-4">
        <span>MAIN RESULT</span>
        <button
          onClick={fetchGames}
          aria-label="Refresh games"
          className="ml-2 sm:ml-4 flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm transition"
        >
          Refresh
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-2 sm:px-3 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-t-4 border-yellow-400 border-solid rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          gameData.map((item) => {
            const { _id, name, openDigits, closeDigits, openingTime, closingTime } = item;
            const openDigitsStr = openDigits?.join("") || "";
            const closeDigitsStr = closeDigits?.join("") || "";
            const midDigits = getLastDigitOfSum(openDigits) + getLastDigitOfSum(closeDigits);
            const closed = isBetClosed(closingTime);

            return (
              <div
                key={_id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 shadow-md"
              >
                {/* Time Row */}
                <div className="text-xs sm:text-sm text-center text-gray-400">
                  Open: {openingTime} | Close: {closingTime}
                </div>

                {/* Game Info Row */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  {/* Left Link / Icon */}
                    <div className="px-2 sm:px-3 py-1 rounded-lg text-lg bg-gray-500 text-gray-300 cursor-not-allowed">
                      <Link
                      to={`/betHistory`}
                      state={{ game: item }}                    >
                      ❤️
                    </Link>
                    </div>


                  {/* Name + Digits */}
                  <div className="flex-1 text-center">
                    <p className="text-sm sm:text-lg font-semibold">{name}</p>
                    <p className="text-yellow-400 text-base sm:text-lg">
                      {openDigitsStr}-{midDigits}-{closeDigitsStr}
                    </p>
                  </div>

                  {/* Right Link / Icon */}
                  {closed ? (
                    <div className="px-2 sm:px-3 py-1 rounded-lg text-lg bg-gray-500 text-gray-300 cursor-not-allowed">
                      🏺
                    </div>
                  ) : (
                    <Link
                      to={`/game/${name.replace(/\s+/g, "-").toLowerCase()}`}
                      state={{ game: item }}
                      aria-label={`View ${name} game`}
                      className="px-2 sm:px-3 py-1 rounded-lg text-lg bg-yellow-400 text-black hover:bg-yellow-300 transition"
                    >
                      🏺
                    </Link>
                  )}
                </div>

                {/* Status */}
                <div
                  className={`text-center text-xs sm:text-sm font-semibold ${
                    closed ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {closed ? "Closed for Today" : "Betting Available"}
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
