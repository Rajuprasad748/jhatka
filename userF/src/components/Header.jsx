import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaWallet, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

function Header() {
  const colors = [
    "text-red-500",
    "text-green-500",
    "text-blue-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
  ];
  const [currentColor, setCurrentColor] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500);
    return () => clearInterval(interval);
  }, [colors.length]);

  useEffect(() => {
    // Check cookie for JWT token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear token from cookies
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-gray-800 text-white shadow-md py-4 px-4 sm:px-8 md:px-16">
      <div className="relative flex items-center justify-between">
        {/* Home Icon */}
        <Link
          to="/"
          aria-label="Home"
          className="text-white text-xl hover:text-gray-300 sm:text-2xl"
        >
          <FaHome />
        </Link>

        {/* Center Title - Hidden on mobile */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <span
            className={`text-lg sm:text-xl md:text-3xl font-bold tracking-wide ${colors[currentColor]} transition-colors duration-300`}
          >
            RoyalMoney9x.com
          </span>
        </div>

        {/* Right Tabs */}
        <div className="flex items-center gap-4 text-sm sm:gap-8 sm:text-base">
          {/* Wallet */}
          <span className="flex items-center gap-1 hover:text-gray-300">
            <FaWallet className="text-lg" />
            ₹ 1,500
          </span>

          {/* Login / Logout */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="flex items-center gap-1 hover:text-gray-300"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              aria-label="Login"
              className="flex items-center gap-1 hover:text-gray-300"
            >
              <FaUserPlus className="text-lg" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
