import React, { useEffect, useState } from "react";
import axios from "axios";

const ABetHistory = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/allGames`
        );
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, []);

  // When a game is clicked → fetch its results
  const handleGameClick = async (game) => {
    setSelectedGame(game);
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/getResultDatewise?gameId=${game._id}`
      );
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Back to game list
  const handleBack = () => {
    setSelectedGame(null);
    setResults([]);
  };

  // ------------------ UI ------------------
  if (selectedGame) {
    return (
      <div className="p-4">
        <button
          onClick={handleBack}
          className="mb-4 px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
        >
          ← Back
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
          {selectedGame.name} - Bet Digits History
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading results...</p>
        ) : results.length === 0 ? (
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
  }

  // Game list view
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Game List</h1>

      <ul className="space-y-2">
        {games.map((game) => (
          <li
            key={game._id}
            onClick={() => handleGameClick(game)}
            className="p-3 border rounded cursor-pointer hover:bg-gray-200"
          >
            <strong>{game.name}</strong>{" "}
            <span className="text-gray-500 text-sm">({game._id})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ABetHistory;
