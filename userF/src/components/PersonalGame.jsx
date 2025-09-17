import { useLocation, Link } from "react-router-dom";

const PersonalGame = () => {
  const location = useLocation();
  const { personalGames } = location.state || { personalGames: [] };

  const rates = [
    { name: "Single Digit", rate: "10-1100" },
    { name: "Single Pana", rate: "10-2000" },
    { name: "Double Pana", rate: "10-4000" },
    { name: "Triple Pana", rate: "10-15000" },
  ];

  // ✅ Utility functions (copy-paste from UData or extract into utils.js)
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getLastDigitOfSum = (digits) => {
    if (!Array.isArray(digits)) return "";
    const total = digits.reduce((sum, num) => sum + Number(num || 0), 0);
    return String(total).slice(-1);
  };

  const isBetClosed = (closingTime) => {
    if (!closingTime) return false;
    const now = new Date();
    const closeDate = new Date(closingTime);
    return now >= closeDate;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8 sm:p-6">

      {(!personalGames || personalGames.length === 0) ? (
        <p className="text-center text-gray-400">No personal games available</p>
      ) : (
        <div className="space-y-4">
          {personalGames.map((item) => {
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
            const closed = isBetClosed(closingTime);

            return (
              <div
                key={_id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 shadow-md"
              >
                {/* Time Row */}
                <div className="text-xs sm:text-sm text-center text-gray-400">
                  Open: {formatTime(openingTime)} | Close:{" "}
                  {formatTime(closingTime)}
                </div>

                {/* Game Info Row */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  {/* Left Link / Icon */}
                  <div>
                    <Link
                      className="px-2 sm:px-3 py-1 rounded-lg text-lg bg-gray-500 text-gray-300 cursor-pointer"
                      to={`/showBetDigitsHistory`}
                      state={{ game: item }}
                    >
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
          })}
        </div>
      )}

      <div className="w-full max-w-sm mx-auto p-4 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl sm:p-6 md:p-8">
      {/* Title */}
      <h1 className="text-lg font-bold text-center mb-4 sm:text-xl md:text-2xl lg:text-3xl sm:mb-6 md:mb-8 text-gray-900">
        Game Rates
      </h1>

      {/* List */}
      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
        {rates.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-800 text-white shadow-sm rounded-lg p-3 border border-gray-700 hover:bg-gray-700 transition-colors duration-200 sm:p-4 md:p-5 sm:rounded-xl md:shadow-md lg:shadow-lg"
          >
            {/* Rate Name */}
            <span className="font-medium text-sm text-gray-100 sm:text-base md:text-lg lg:text-xl">{item.name}</span>

            {/* Game Rate */}
            <span className="font-bold text-sm text-green-400 sm:text-base md:text-lg lg:text-xl">{item.rate}</span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default PersonalGame;
