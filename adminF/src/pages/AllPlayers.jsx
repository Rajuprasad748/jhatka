import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { LuDownload } from "react-icons/lu";

const AllPlayers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/all-users`
        );
        setUsers(res.data.users);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Navigate to userBetDetails
  const handleViewDetails = (userId) => {
    navigate("/users/userBetDetails", { state: { userId } });
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (!filteredUsers.length) return alert("No data to export!");
    const data = filteredUsers.map((user, index) => ({
      "#": index + 1,
      ID: user._id,
      Name: user.name,
      Mobile: user.mobile,
      "Wallet Balance": user.walletBalance ?? 0,
      "Created At": new Date(user.createdAt).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(
      workbook,
      `AllUsers_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // ✅ Search filter
  useEffect(() => {
    let filtered = [...users];
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.mobile?.toString().includes(searchTerm)
      );
    }

    // ✅ Sorting
    if (sortType === "walletAsc") {
      filtered.sort((a, b) => (a.walletBalance ?? 0) - (b.walletBalance ?? 0));
    } else if (sortType === "walletDesc") {
      filtered.sort((a, b) => (b.walletBalance ?? 0) - (a.walletBalance ?? 0));
    } else if (sortType === "dateAsc") {
      filtered.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortType === "dateDesc") {
      filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, sortType, users]);

  // ✅ Skeleton components
  const SkeletonCard = () => (
    <div className="border rounded-lg p-4 bg-gray-800 animate-pulse">
      <div className="h-4 bg-gray-700 w-20 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-32 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-40 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-24 mb-2 rounded"></div>
      <div className="h-3 bg-gray-700 w-36 mb-2 rounded"></div>
    </div>
  );

  const SkeletonTableRow = () => (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="border px-4 py-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-xl font-semibold mb-2 text-center text-gray-800">
        All Users
      </h2>

      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {!loading && (
        <p className="text-center text-sm text-gray-600 mb-4">
          Total Users: <span className="font-bold">{filteredUsers.length}</span>
        </p>
      )}

      {/* ✅ Search and Sort Section */}
      {!loading && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-400 rounded-lg px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sort Dropdown */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-400 rounded-lg px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by</option>
            <option value="walletAsc">Wallet Balance (Low → High)</option>
            <option value="walletDesc">Wallet Balance (High → Low)</option>
            <option value="dateAsc">Date (Oldest → Newest)</option>
            <option value="dateDesc">Date (Newest → Oldest)</option>
          </select>

          {/* Download Button */}
          {filteredUsers.length > 0 && (
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center"
            >
              Download <LuDownload className="inline-block ml-1" />
            </button>
          )}
        </div>
      )}

      {/* ✅ Skeleton Loading */}
      {loading && (
        <>
          {/* Mobile Skeleton */}
          <div className="block md:hidden space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border px-4 py-2 text-left">#</th>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Mobile</th>
                  <th className="border px-4 py-2 text-left">Wallet Balance</th>
                  <th className="border px-4 py-2 text-left">Created At</th>
                  <th className="border px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ✅ Mobile View */}
      <div
        className={`block md:hidden space-y-4 transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {!loading &&
          (filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p className="text-sm font-medium">#{index + 1}</p>
                <p className="text-sm">
                  <span className="font-medium">ID:</span> {user._id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Mobile:</span> {user.mobile}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Wallet Balance:</span> ₹
                  {user.walletBalance ?? 0}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(user.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleViewDetails(user._id)}
                  className="mt-2 bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  View Bets
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center">
              <img
                src="https://cdn.dribbble.com/users/2131993/screenshots/6007793/no_result.gif"
                alt="No Users"
                className="w-60"
              />
            </div>
          ))}
      </div>

      {/* ✅ Desktop View */}
      <div
        className={`hidden md:block overflow-x-auto transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {!loading &&
          (filteredUsers.length > 0 ? (
            <table className="w-full table-auto border border-gray-300">
              <thead className="sticky top-0 bg-gray-300">
                <tr>
                  <th className="border px-4 py-2 text-left">#</th>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Mobile</th>
                  <th className="border px-4 py-2 text-left">Wallet Balance</th>
                  <th className="border px-4 py-2 text-left">Created At</th>
                  <th className="border px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{user._id}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.mobile}</td>
                    <td className="border px-4 py-2">
                      ₹{user.walletBalance ?? 0}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleViewDetails(user._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        View Bets
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center py-10">
              <img
                src="https://cdn.dribbble.com/users/2131993/screenshots/6007793/no_result.gif"
                alt="No Users"
                className="w-60"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllPlayers;
