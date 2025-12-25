import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function UserBetRecord() {
  const [bets, setBets] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    marketType: "",
    status: "",
    betType: "",
    startDate: "",
    endDate: "",
    gameName: "",
    mobile: "", // Added Mobile filter
  });

  const [gameNames, setGameNames] = useState([]); // Unique game names for dropdown

  // Fetch all bets
  const fetchBets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if(!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      };
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/allBets`,
        {
          withCredentials: true,
          headers,
        }
      );
      setBets(res.data);
      setFilteredBets(res.data);

      // Extract unique game names for filter dropdown
      const uniqueGames = [...new Set(res.data.map((bet) => bet.gameName))];
      setGameNames(uniqueGames);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching bets:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...bets];

    if (filters.marketType)
      filtered = filtered.filter((b) => b.marketType === filters.marketType);

    if (filters.status)
      filtered = filtered.filter((b) => b.status === filters.status);

    if (filters.betType)
      filtered = filtered.filter((b) => b.betType === filters.betType);

    if (filters.startDate)
      filtered = filtered.filter(
        (b) => new Date(b.date) >= new Date(filters.startDate)
      );

    if (filters.endDate)
      filtered = filtered.filter(
        (b) => new Date(b.date) <= new Date(filters.endDate)
      );

    if (filters.gameName)
      filtered = filtered.filter((b) => b.gameName === filters.gameName);

    if (filters.mobile)
      filtered = filtered.filter((b) =>
        b.user?.mobile?.includes(filters.mobile)
      );

    setFilteredBets(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      marketType: "",
      status: "",
      betType: "",
      startDate: "",
      endDate: "",
      gameName: "",
      mobile: "",
    });
    setFilteredBets(bets);
  };

  // Main grouping logic (combine redundant records)
  const handleMainGrouping = () => {
    const grouped = {};

    filteredBets.forEach((bet) => {
      const dateKey = new Date(bet.date).toLocaleDateString("en-IN"); // group by date
      const key = `${dateKey}_${bet.gameName}_${bet.betType}_${bet.marketType}_${bet.status}_${bet.digits}_${bet.user?._id}`;

      if (!grouped[key]) {
        grouped[key] = {
          ...bet,
          totalPoints: bet.points,
          totalWinningAmount: bet.winningAmount,
          count: 1,
        };
      } else {
        grouped[key].totalPoints += bet.points;
        grouped[key].totalWinningAmount += bet.winningAmount;
        grouped[key].count += 1;
      }
    });

    const result = Object.values(grouped).map((item) => ({
      ...item,
      isGrouped: item.count > 1,
    }));

    setFilteredBets(result);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        User Bet History
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4">
        <select
          name="marketType"
          value={filters.marketType}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Market Type</option>
          <option value="open">Open</option>
          <option value="close">Close</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

        <select
          name="betType"
          value={filters.betType}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Bet Type</option>
          <option value="singleDigit">Single Digit</option>
          <option value="jodi">Jodi</option>
          <option value="singlePana">Single Pana</option>
          <option value="doublePana">Double Pana</option>
          <option value="triplePana">Triple Pana</option>
          <option value="halfSangam">Half Sangam</option>
          <option value="fullSangam">Full Sangam</option>
        </select>

        <select
          name="gameName"
          value={filters.gameName}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Game Name</option>
          {gameNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={filters.mobile}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>

        <button
          onClick={handleMainGrouping}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Main
        </button>

        <button
          onClick={resetFilters}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            {Array(5)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
          </div>
        ) : (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Mobile</th>
                <th className="border px-3 py-2">Game Name</th>
                <th className="border px-3 py-2">Bet Type</th>
                <th className="border px-3 py-2">Market</th>
                <th className="border px-3 py-2">Digits</th>
                <th className="border px-3 py-2">Points</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Winning Amount</th>
                <th className="border px-3 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredBets.length > 0 ? (
                filteredBets.map((bet) => (
                  <tr
                    key={bet._id}
                    className={`text-center transition-all ${
                      bet.isGrouped ? "bg-purple-200 border-purple-200" : ""
                    }`}
                  >
                    <td className="border px-3 py-2">
                      {new Date(bet.date).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="border px-3 py-2">
                      {bet.user?.name || "N/A"}
                    </td>
                    <td className="border px-3 py-2">
                      {bet.user?.mobile || "N/A"}
                    </td>
                    <td className="border px-3 py-2">{bet.gameName}</td>
                    <td className="border px-3 py-2">{bet.betType}</td>
                    <td className="border px-3 py-2">{bet.marketType}</td>
                    <td className="border px-3 py-2">{bet.digits}</td>
                    <td className="border px-3 py-2 font-semibold">
                      {bet.totalPoints || bet.points}
                    </td>
                    <td
                      className={`border px-3 py-2 font-medium ${
                        bet.status === "won"
                          ? "text-green-600"
                          : bet.status === "lost"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {bet.status}
                    </td>
                    <td className="border px-3 py-2 font-semibold">
                      {bet.totalWinningAmount || bet.winningAmount}
                    </td>
                    <td className="border px-3 py-2">
                      {bet.count ? bet.count : 1}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4 text-gray-500">
                    No bets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserBetRecord;