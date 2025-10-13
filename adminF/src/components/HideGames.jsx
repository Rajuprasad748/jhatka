import React, { useEffect, useState } from "react";
import axios from "axios";

const HideGames = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [toShow, setToShow] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch all games
  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/allGames` , {
          withCredentials: true,headers: {
      Authorization: `Bearer ${token}`, // 🔥 sending manually
    },
        }
        );
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching games", err);
      }
    };
    fetchGames();
  }, []);

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedGame || toShow === null) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin/games/${selectedGame}/showToUsers`,
        { toShow }
      );

      // update state locally
      setGames((prev) =>
        prev.map((g) => (g._id === res.data._id ? res.data : g))
      );

      alert("Game updated successfully!");
      setShowConfirm(false);
    } catch (err) {
      console.error("Error updating game", err);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-4 text-center">Manage Game Visibility</h2>

      {/* Dropdown + Radio form */}
      <div className="w-full mb-6">
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">-- Select a Game --</option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {game.name}
            </option>
          ))}
        </select>

        <div className="flex gap-4 mb-4">
          <label>
            <input
              type="radio"
              name="showOption"
              value="yes"
              checked={toShow === true}
              onChange={() => setToShow(true)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="showOption"
              value="no"
              checked={toShow === false}
              onChange={() => setToShow(false)}
            />
            No
          </label>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={() => setShowConfirm(true)}
          disabled={!selectedGame || toShow === null}
        >
          Submit
        </button>
      </div>

      {/* Games Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Opening Time</th>
              <th className="p-2 border">Closing Time</th>
              <th className="p-2 border">Visible</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game._id} className="text-center">
                <td className="p-2 border">{game.name}</td>
                <td className="p-2 border">
                  {new Date(game.openingTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2 border">
                  {new Date(game.closingTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2 border">
                  {game.showToUsers ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-bold">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="mb-4 text-center">
              Are you sure you want to set{" "}
              <b>{toShow ? "Visible" : "Hidden"}</b> for this game?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
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

export default HideGames;
