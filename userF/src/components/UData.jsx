import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiFillHeart } from "react-icons/ai";
import { GiAmphora } from "react-icons/gi";
import { BiRefresh } from "react-icons/bi";

// 🔹 Skeleton for banner
const BannerSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 sm:h-14 bg-red-700/60 rounded-lg w-full" />
  </div>
);

// 🔹 Skeleton for game card
const GameSkeleton = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 shadow-md animate-pulse">
    <div className="h-3 w-2/3 bg-gray-700 rounded mx-auto mb-3"></div>
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <div className="h-8 w-8 bg-gray-700 rounded-lg"></div>
      <div className="flex-1 text-center">
        <div className="h-4 w-20 bg-gray-700 rounded mx-auto mb-2"></div>
        <div className="h-5 w-32 bg-gray-700 rounded mx-auto"></div>
      </div>
      <div className="h-8 w-8 bg-gray-700 rounded-lg"></div>
    </div>
    <div className="h-3 w-1/3 bg-gray-700 rounded mx-auto mt-3"></div>
  </div>
);

const UData = () => {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");

  // Format to local 24h time (IST)
  const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
  };

  // Fetch games from backend
  const fetchGames = useCallback(async () => {
    if (initialLoad) setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/games`,
        { withCredentials: true }
      );

      const filtered = data.filter((g) => g.showToUsers);

      const sorted = [...filtered].sort(
        (a, b) => new Date(a.openingTime) - new Date(b.openingTime)
      );

      setGameData(sorted);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError(
        err.response?.data?.message || "Failed to load games. Please try again."
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [initialLoad]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchGames();
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 15000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  // Helper: last digit of sum
  const getLastDigitOfSum = (digits) => {
    if (!Array.isArray(digits) || digits.length === 0) return "X";
    const total = digits.reduce((sum, num) => sum + Number(num || 0), 0);
    return String(total).slice(-1);
  };

  // Determine game status
  const getGameStatus = (openingTime, closingTime) => {
    const now = new Date();
    const open = new Date(openingTime);
    const close = new Date(closingTime);

    if (now < open) return "beforeOpen"; // can bet both
    if (now >= open && now < close) return "afterOpen"; // can bet close only
    return "closed"; // both passed
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800 p-4 shadow text-center text-lg sm:text-2xl font-bold text-yellow-400 border-b border-gray-700 flex items-center justify-center gap-4">
        <span>MAIN RESULT</span>
        <button
          onClick={handleRefresh}
          aria-label="Refresh games"
          className="ml-2 sm:ml-4 flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm transition"
        >
          <BiRefresh className="text-lg" />
          Refresh
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-2 sm:px-3 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Banner */}
        {initialLoad && loading ? (
          <BannerSkeleton />
        ) : (
          <div className="text-center bg-red-600 text-white py-3 px-4 rounded-lg text-base sm:text-lg">
            <Link
              to="/personalGame"
              className="hover:underline animate-blink"
              state={{ personalGames: gameData.filter((g) => g.isPersonal) }}
            >
              To earn more, play this game. Click here
            </Link>
          </div>
        )}

        {/* Game List */}
        {initialLoad && loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <GameSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}{" "}
            <button
              onClick={fetchGames}
              className="underline hover:text-red-300"
            >
              Retry
            </button>
          </div>
        ) : (
          gameData.map((item) => {
            const {
              _id,
              name,
              openDigits,
              closeDigits,
              openingTime,
              closingTime,
            } = item;

            const openDigitsStr = openDigits?.join("") || "";
            const closeDigitsStr = closeDigits?.join("") || "";
            const midDigits =
              getLastDigitOfSum(openDigits) + getLastDigitOfSum(closeDigits);
            const status = getGameStatus(openingTime, closingTime);

            return (
              <div
                key={_id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md space-y-3"
              >
                {/* Time Row */}
                <div className="text-xs sm:text-sm text-center text-gray-400">
                  Open: {formatTime(openingTime)} | Close:{" "}
                  {formatTime(closingTime)}
                </div>

                {/* Game Info Row */}
                <div className="flex items-center justify-between">
                  {/* Left Icon → BetDigitHistory always available if logged in */}
                  <Link
                    to={`/showBetDigitsHistory`}
                    state={{ game: item }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white hover:bg-gray-500 transition"
                  >
                    <AiFillHeart className="text-lg" />
                  </Link>

                  {/* Name + Digits */}
                  <div className="flex-1 text-center">
                    <p className="text-sm sm:text-lg font-semibold">{name}</p>
                    <p className="text-yellow-400 text-base sm:text-lg">
                      {openDigitsStr}-{midDigits}-{closeDigitsStr}
                    </p>
                  </div>

                  {/* Right Icon → Betting availability */}
                  {status === "closed" ? (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-gray-300 cursor-not-allowed">
                      <GiAmphora className="text-lg" />
                    </div>
                  ) : (
                    <Link
                      to={`/game/${name.replace(/\s+/g, "-").toLowerCase()}`}
                      state={{ game: { ...item, status } }}
                      aria-label={`View ${name} game`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition"
                    >
                      <GiAmphora className="text-lg" />
                    </Link>
                  )}
                </div>

                {/* Status */}
                <div
                  className={`text-center text-xs sm:text-sm font-semibold ${
                    status === "closed"
                      ? "text-red-400"
                      : status === "beforeOpen"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {status === "closed"
                    ? "Closed for Today"
                    : status === "beforeOpen"
                    ? "Betting Available"
                    : "Closing Session Open"}
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
