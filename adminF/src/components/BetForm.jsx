import React, { useEffect, useState } from "react";
import axios from "axios";

const BetForm = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [type, setType] = useState("open");
  const [digits, setDigits] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/games`
        );
        setGames(res.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGame || !digits)
      return alert("Please select a game and enter digits");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/set-result/${selectedGame}`,
        {
          type,
          value: digits,
        }
      );
      
      setGames(games.map((g) => (g._id === res.data._id ? res.data : g)));
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div
      className="p-4 max-w-lg mx-auto flex flex-col"
      style={{ minHeight: "80vh", maxHeight: "90vh" }}
    >
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
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
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Select Game</option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {game.name}
            </option>
          ))}
        </select>

        {/* Radio Buttons */}
        <div className="flex flex-col sm:flex-row sm:gap-8 gap-8 justify-around items-start sm:items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="open"
              checked={type === "open"}
              onChange={() => setType("open")}
              className="form-radio text-blue-500"
            />
            Open
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="close"
              checked={type === "close"}
              onChange={() => setType("close")}
              className="form-radio text-blue-500"
            />
            Close
          </label>
        </div>

        {/* Digits Input */}
        <input
          type="number"
          placeholder="Enter digits e.g. 372"
          value={digits}
          onChange={(e) => {
            // Only allow up to 3 digits and remove non-numeric input
            const val = e.target.value.replace(/\D/g, "").slice(0, 3);
            setDigits(val);
          }}
          maxLength={3}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue"
        ></input>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
        >
          Update
        </button>
      </form>

      {/* Live Data Display */}
      <div
        className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner overflow-y-auto"
        style={{ maxHeight: "220px", minHeight: "120px" }}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
          Live Data
        </h3>
        <ul className="space-y-2">
          {games.map((game) => (
            <li
              key={game._id}
              className="flex flex-col sm:flex-row sm:justify-between bg-white p-2 rounded shadow"
            >
              <span className="font-medium">{game.name}</span>
              <span className="text-sm text-gray-700">
                Open: {game.openDigits.join("")} | Close:{" "}
                {game.closeDigits.join("")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BetForm;
