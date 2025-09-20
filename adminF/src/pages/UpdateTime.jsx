import React, { useState, useEffect } from "react";
import axios from "axios";

// Reusable Time Selector for 24-hour format
const TimeSelector = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-2 font-medium">{label}</label>
    <div className="flex gap-2">
      <select
        value={value.hour}
        onChange={(e) => onChange("hour", e.target.value)}
        className="border p-2 rounded flex-1"
      >
        <option value="">HH</option>
        {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map(
          (h) => (
            <option key={h} value={h}>
              {h}
            </option>
          )
        )}
      </select>

      <select
        value={value.minute}
        onChange={(e) => onChange("minute", e.target.value)}
        className="border p-2 rounded flex-1"
      >
        <option value="">MM</option>
        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map(
          (m) => (
            <option key={m} value={m}>
              {m}
            </option>
          )
        )}
      </select>
    </div>
  </div>
);

const UpdateTime = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [openingTime, setOpeningTime] = useState({ hour: "", minute: "" });
  const [closingTime, setClosingTime] = useState({ hour: "", minute: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch all games
  const fetchGames = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/allGames`
      );
      setGames(data);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
    }
  };

  // Fetch selected game times
  useEffect(() => {
    const fetchGameTimes = async () => {
      if (!selectedGame) return;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/games/${selectedGame}`
        );

        if (data.openingTime) {
          const date = new Date(data.openingTime);
          setOpeningTime({
            hour: String(date.getHours()).padStart(2, "0"),
            minute: String(date.getMinutes()).padStart(2, "0"),
          });
        }

        if (data.closingTime) {
          const date = new Date(data.closingTime);
          setClosingTime({
            hour: String(date.getHours()).padStart(2, "0"),
            minute: String(date.getMinutes()).padStart(2, "0"),
          });
        }
      } catch (err) {
        console.error("Error fetching game times:", err);
        setError("Failed to fetch game times");
      }
    };

    fetchGameTimes();
  }, [selectedGame]);

  // Handle changes in TimeSelector
  const handleTimeChange = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  // Format time as HH:MM
  const formatTime = ({ hour, minute }) => {
    if (hour === "" || minute === "") return "";
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  // Submit updated times
  const handleSubmit = async () => {
    setError("");
    if (!selectedGame || !openingTime.hour || !closingTime.hour) {
      setError("Please select a game and both times!");
      return;
    }

    const formattedOpening = formatTime(openingTime);
    const formattedClosing = formatTime(closingTime);

    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/games/updateTime/${selectedGame}`,
        {
          openingTime: formattedOpening,
          closingTime: formattedClosing,
        }
      );
      alert("Game times updated successfully!");
      fetchGames(); // Refresh list if needed
    } catch (err) {
      console.error("Error updating times:", err);
      setError("Failed to update times");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading ||
    !selectedGame ||
    !openingTime.hour ||
    !openingTime.minute ||
    !closingTime.hour ||
    !closingTime.minute;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Update Game Times</h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

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
      <TimeSelector
        label="Opening Time"
        value={openingTime}
        onChange={(field, val) => handleTimeChange(setOpeningTime, field, val)}
      />

      {/* Closing Time */}
      <TimeSelector
        label="Closing Time"
        value={closingTime}
        onChange={(field, val) => handleTimeChange(setClosingTime, field, val)}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className={`w-full py-2 px-4 rounded text-white ${
          isSubmitDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Updating..." : "Update Times"}
      </button>
    </div>
  );
};

export default UpdateTime;
