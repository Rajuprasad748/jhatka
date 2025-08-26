import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaWallet, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/useAuth"; // ✅ import your context hook

function Header() {
  const { user, logout, loading } = useAuth(); // ✅ get user & logout from context
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // ✅ call context logout
      setShowConfirm(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <header className="w-full bg-gray-800 text-white shadow-md py-3 px-4 sm:px-6 md:px-10">
        <div className="relative flex items-center justify-between">
          {/* Left: Home */}
          <Link
            to="/"
            aria-label="Home"
            className="text-white text-xl hover:text-gray-300 sm:text-2xl"
          >
            <FaHome />
          </Link>

          {/* Center Title with animated gradient */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
            <span className="text-lg sm:text-xl md:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 animate-gradient bg-[length:300%_300%]">
              RoyalMoney9x.com
            </span>
          </div>

          {/* Right: Wallet + Login/Logout */}
          <div className="flex items-center gap-4 text-sm sm:gap-6 sm:text-base">
            {!loading && user && (
              <span className="flex items-center gap-1 hover:text-gray-300 text-sm sm:text-base">
                <FaWallet className="text-lg" /> {user.walletBalance}
              </span>
            )}

            {!loading &&
              (user ? (
                <button
                  onClick={() => setShowConfirm(true)} // 🔥 open confirm dialog
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
              ))}
          </div>
        </div>
      </header>

      {/* 🔥 Confirmation Dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-8">
              Are you sure you want to logout?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-12 py-2 rounded-md hover:bg-red-700 w-full sm:w-auto"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-800 px-12 py-2 rounded-md hover:bg-gray-400 w-full sm:w-auto"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
