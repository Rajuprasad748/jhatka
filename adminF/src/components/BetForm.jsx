import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BetForm = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [type, setType] = useState("open");
  const [digits, setDigits] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // 👈 modal state

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("token");
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/allGames`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 sending manually
            },
          }
        );
        setGames(res.data);
      } catch (error) {
        toast.error(
          `⚠️ ${error.response?.data?.message || "Failed to fetch games"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleFinalSubmit = async () => {
    setShowConfirm(false);
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      console.log(type , digits);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/set-result/${selectedGame}`,
        { type, value: digits },
        {
          withCredentials: true,
          headers: token ? {
            Authorization: `Bearer ${token}`, // 🔥 sending manually
          } : {},
        }
      );

      setGames(games.map((g) => (g._id === res.data._id ? res.data : g)));
      toast.success("✅ Updated successfully!");
      setDigits("");
      console.log("object of the starig session frontend");
    } catch (err) {
      toast.error(`⚠️ ${err.response?.data?.message || "Update failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGame || !digits) {
      return toast.warning("⚠️ Please select a game and enter digits");
    }
    // 👇 open modal instead of direct submit
    setShowConfirm(true);
  };

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col mt-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
        Update Game Digits
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-4 space-y-4 flex flex-col"
      >
        {/* Game Dropdown */}
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
        >
          <option value="">Select Game</option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {game.name}
            </option>
          ))}
        </select>

        {/* Radio Buttons */}
        <div className="flex justify-center gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="open"
              checked={type === "open"}
              onChange={() => setType("open")}
              className="text-blue-500"
            />
            Open
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="close"
              checked={type === "close"}
              onChange={() => setType("close")}
              className="text-blue-500"
            />
            Close
          </label>
        </div>

        {/* Digits Input */}
        <input
          type="number"
          placeholder="Enter digits (e.g. 372)"
          value={digits}
          onChange={(e) =>
            setDigits(e.target.value.replace(/\D/g, "").slice(0, 3))
          }
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400 font-mono"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-md transition"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      {/* Live Data Display */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner overflow-y-auto max-h-56">
        <h3 className="text-lg font-semibold mb-2 text-center">Live Data</h3>
        {loading && games.length === 0 ? (
          <p className="text-center text-gray-500">Loading games...</p>
        ) : (
          <ul className="space-y-2">
            {games.map((game) => (
              <li
                key={game._id}
                className={`flex justify-between bg-white p-2 rounded shadow-sm ${
                  selectedGame === game._id ? "border-2 border-blue-400" : ""
                }`}
              >
                <span className="font-medium">{game.name}</span>
                <span className="text-sm text-gray-700 font-mono">
                  Open: {game.openDigits?.join("") || "-"} | Close:{" "}
                  {game.closeDigits?.join("") || "-"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
              Confirm Update
            </h3>
            <p className="text-md text-gray-600 text-center mb-6">
              Are you sure you want to set <br />
              <span className="font-bold">{digits}</span> as{" "}
              <span className="font-bold capitalize">{type}</span> digits for{" "}
              <span className="font-bold">
                {games.find((g) => g._id === selectedGame)?.name}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleFinalSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-24 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md w-24 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetForm;
