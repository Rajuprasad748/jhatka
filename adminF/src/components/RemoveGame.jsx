import React, { useState, useEffect } from "react";
import axios from "axios";

const RemoveGame = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch all games on mount
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/allGames`,
          { withCredentials: true }
        );
        setGames(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch games.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);



  const handleDelete = async () => {
    if (!selectedGame) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/admin/deleteGame/${selectedGame}`,
        {
          withCredentials: true,headers: {
      Authorization: `Bearer ${token}`, // 🔥 sending manually
    },
        }
      );
      setGames(games.filter((g) => g._id !== selectedGame));
      setSelectedGame("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to delete game.");
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🗑 Remove Game</h2>

      {loading ? (
        <p className="text-center">Loading games...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full border p-2 rounded-lg mb-4 max-h-48 overflow-y-auto"
          >
            <option value="">Select a game to delete</option>
            {games.map((game) => (
              <option key={game._id} value={game._id}>
                {game.name.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            disabled={!selectedGame}
            className={`w-full py-2 rounded-lg text-white font-semibold ${
              selectedGame
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition`}
          >
            Delete Game
          </button>
        </>
      )}

      {/* ✅ Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this game? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveGame;
