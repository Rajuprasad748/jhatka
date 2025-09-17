import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ShowBetDigitsHistory = () => {
  const location = useLocation();
  const { game } = location.state || {};

  const gameId = game ? game._id : null;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/getResultDatewise?gameId=${gameId}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    if (gameId) fetchResults();
  }, [gameId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading results...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Bet Digits History
      </h2>

      {results.length === 0 ? (
        <p className="text-center text-gray-500">No results available</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center border border-gray-800 shadow-md rounded-lg p-4 bg-slate-700 hover:shadow-lg transition"
            >
              <p className="text-sm text-white mb-2">{item._id.date}</p>
              <div className="flex w-full justify-between text-center">
                <div className="flex-1">
                  <p className="text-white text-xs">Open</p>
                  <p className="text-lg font-bold text-green-600">
                    {item.open ? item.open.join("") : "-"}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs">Close</p>
                  <p className="text-lg font-bold text-red-600">
                    {item.close ? item.close.join("") : "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowBetDigitsHistory;
