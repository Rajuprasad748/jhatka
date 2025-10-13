import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ShowBetDigitsHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game } = location.state || {};
  const gameId = game ? game._id : null;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!game) navigate("/"); // Redirect if no game data
  }, [game, navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/getResultDatewise?gameId=${gameId}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (gameId) fetchResults();
  }, [gameId]);

  // Helper function to compute last digit of digit sum
  const getLastDigitOfSum = (digits) => {
    if (!digits || digits.length === 0) return "-";
    const sum = digits.reduce((acc, d) => acc + Number(d), 0);
    return sum % 10; // last digit
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="flex flex-col items-center justify-center border border-gray-700 shadow rounded-lg p-4 bg-slate-600 animate-pulse">
      <div className="h-4 w-24 bg-gray-500 rounded mb-3"></div>
      <div className="flex w-full justify-between items-center text-center">
        <div className="flex-1">
          <div className="h-3 w-10 bg-gray-500 rounded mx-auto mb-2"></div>
          <div className="h-6 w-12 bg-gray-400 rounded mx-auto"></div>
        </div>
        <div className="flex-1">
          <div className="h-6 w-12 bg-gray-400 rounded mx-auto"></div>
        </div>
        <div className="flex-1">
          <div className="h-3 w-10 bg-gray-500 rounded mx-auto mb-2"></div>
          <div className="h-6 w-12 bg-gray-400 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {results.length === 0 ? (
        <p className="text-center text-gray-500">No results available</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {results.map((item, idx) => {
            const openDigits = item.open || [];
            const closeDigits = item.close || [];
            const openSumDigit = getLastDigitOfSum(openDigits);
            const closeSumDigit = getLastDigitOfSum(closeDigits);

            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center border border-gray-800 shadow-md rounded-lg p-4 bg-slate-700 hover:shadow-lg transition"
              >
                <p className="text-sm text-white mb-2">
                  {new Date(item._id.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="flex w-full justify-between text-center items-center">
                  {/* Open Section */}
                  <div className="flex-1">
                    <p className="text-white text-xs">Open</p>
                    <p className="text-lg font-bold text-green-600">
                      {openDigits?.join("") || "-"}
                    </p>
                  </div>

                  {/* Middle Sum Section */}
                  <div className="flex items-center px-3 text-3xl">
                    <p className="text-green-500 font-bold ">
                      {openSumDigit}
                    </p>
                    <p className="text-red-500 font-bold">
                      {closeSumDigit}
                    </p>
                  </div>

                  {/* Close Section */}
                  <div className="flex-1">
                    <p className="text-white text-xs">Close</p>
                    <p className="text-lg font-bold text-red-600">
                      {closeDigits?.join("") || "-"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowBetDigitsHistory;
