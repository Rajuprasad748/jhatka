import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BetRecall = () => {
  const [date, setDate] = useState("");
  const [gameList, setGameList] = useState([]);
  const [gameId, setGameId] = useState("");
  const [marketType, setMarketType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch all games for dropdown
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }
    const fetchGames = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/allGames`, 
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }, // 🔥 sending manually
          }
        );
        setGameList(res.data || []);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, []);

  // ✅ Handle Recall Button
  const handleRecall = async () => {
    if (!date || !gameId || !marketType)
      return setMessage("⚠️ Please select all fields.");

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/recallResult`,
        { date, gameId, marketType },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }, // 🔥 sending manually
        }
      );

      if (res.data.success) {
        setMessage("✅ Results recalled successfully!");
      } else {
        setMessage(`❌ ${res.data.message || "Failed to recall results."}`);
      }
    } catch (err) {
      console.error("Error recalling results:", err);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Recall Game Results
      </h2>

      <div className="space-y-3">
        {/* Date Picker */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Game Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Select Game
          </label>
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Game --</option>
            {gameList.map((game) => (
              <option key={game._id} value={game._id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        {/* Market Type Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Market Type
          </label>
          <select
            value={marketType}
            onChange={(e) => setMarketType(e.target.value)}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Market Type --</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </div>

        {/* Recall Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleRecall}
            disabled={loading}
            className={`px-5 py-2 rounded text-white font-medium transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Recalling..." : "Recall Results"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center mt-3 font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BetRecall;
