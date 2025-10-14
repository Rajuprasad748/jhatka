import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { useAdminAuth } from "../context/useAuth";
import axios from "axios";

function Header() {
  const token = localStorage.getItem("token");
  const colors = [
    "text-red-500",
    "text-yellow-400",
    "text-green-500",
    "text-blue-500",
    "text-pink-500",
    "text-purple-500",
    "text-orange-400",
    "text-emerald-400",
    "text-indigo-400",
  ];
  const [currentColor, setCurrentColor] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [amount, setAmount] = useState(0);

  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500);
    return () => clearInterval(interval);
  }, [colors.length]);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/contactInfo`
        );
        setAmount(response.data[0].amount);
      } catch (error) {
        console.error("Error fetching amount:", error);
      }
    };

    fetchAmount();
  }, [admin]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowConfirm(false);
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="w-full p-4 bg-gray-800 shadow-md">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Home Icon */}
        <Link
          to="/"
          className="text-white text-2xl sm:text-3xl p-2 hover:text-yellow-400 transition-colors flex items-center"
        >
          <AiFillHome />
        </Link>

        {/* Logo Title - hidden on mobile */}
        <div className="text-center flex-1 hidden sm:block">
          <span
            className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider ${colors[currentColor]} transition-colors duration-300`}
          >
            RoyalMoney10x
          </span>
        </div>
        <div
          className={`font-bold ${token ? "block" : "hidden"} ${
            amount >= 0 ? "text-green-500" : "text-red-500"
          } text-lg sm:text-xl md:text-2xl mx-8`}
        >
          {token ? `Balance: ₹${amount}` : "Welcome, Admin"}
        </div>

        {/* Auth Buttons */}
        {admin ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-white text-sm sm:text-base p-2 px-3 bg-red-600 hover:bg-red-700 rounded-md transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="text-white text-sm sm:text-base p-2 px-3 bg-green-600 hover:bg-green-700 rounded-md transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
