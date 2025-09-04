import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateTime = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [openingTime, setOpeningTime] = useState({ hour: "", minute: "", period: "AM" });
  const [closingTime, setClosingTime] = useState({ hour: "", minute: "", period: "AM" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch all games
  const fetchGames = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/allGames`);
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  // Fetch selected game times and pre-fill dropdowns
  useEffect(() => {
    const fetchGameTimes = async () => {
      if (!selectedGame) return;

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/games/${selectedGame}`);

        if (data.openingTime) {
          const [hourMin, period] = data.openingTime.split(" ");
          const [hour, minute] = hourMin.split(":");
          setOpeningTime({ hour, minute: minute.padStart(2, "0"), period });
        }

        if (data.closingTime) {
          const [hourMin, period] = data.closingTime.split(" ");
          const [hour, minute] = hourMin.split(":");
          setClosingTime({ hour, minute: minute.padStart(2, "0"), period });
        }
      } catch (error) {
        console.error("Error fetching game times:", error);
      }
    };

    fetchGameTimes();
  }, [selectedGame]);

  const handleTimeChange = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const formatTime = (time) => {
    if (!time.hour || time.minute === "") return "";
    return `${time.hour}:${time.minute.padStart(2, "0")} ${time.period}`;
  };

  const handleSubmit = async () => {
    if (!selectedGame || !openingTime.hour || !closingTime.hour) {
      alert("Please select a game and both times!");
      return;
    }

    const formattedOpening = formatTime(openingTime);
    const formattedClosing = formatTime(closingTime);

    try {
      setLoading(true);
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/games/updateTime/${selectedGame}`, {
        openingTime: formattedOpening,
        closingTime: formattedClosing,
      });
      alert("Game times updated successfully!");
      fetchGames();
    } catch (error) {
      console.error("Error updating times:", error);
      alert("Failed to update times");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Update Game Times</h2>

      {/* Select Game */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Game</label>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Game --</option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {/* Opening Time */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Opening Time</label>
        <div className="flex gap-2">
          <select
            value={openingTime.hour}
            onChange={(e) => handleTimeChange(setOpeningTime, "hour", e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="">HH</option>
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <select
            value={openingTime.minute}
            onChange={(e) => handleTimeChange(setOpeningTime, "minute", e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="">MM</option>
            {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={openingTime.period}
            onChange={(e) => handleTimeChange(setOpeningTime, "period", e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Closing Time */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Closing Time</label>
        <div className="flex gap-2">
          <select
            value={closingTime.hour}
            onChange={(e) => handleTimeChange(setClosingTime, "hour", e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="">HH</option>
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <select
            value={closingTime.minute}
            onChange={(e) => handleTimeChange(setClosingTime, "minute", e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="">MM</option>
            {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={closingTime.period}
            onChange={(e) => handleTimeChange(setClosingTime, "period", e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Updating..." : "Update Times"}
      </button>
    </div>
  );
};

export default UpdateTime;
