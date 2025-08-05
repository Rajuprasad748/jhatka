import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaWallet, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

function Header() {
  const colors = [
    'text-red-500', 'text-green-500', 'text-blue-500', 
    'text-yellow-500', 'text-purple-500', 'text-pink-500'
  ];
  const [currentColor, setCurrentColor] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500);
    return () => clearInterval(interval);
  }, [colors.length]);

  return (
    <header className="w-full bg-gray-800 text-white shadow-md py-4 px-4 sm:px-8 md:px-16">
      <div className="relative flex items-center justify-between">

        {/* Home Icon */}
        <Link to="/" aria-label="Home" className="text-white text-xl hover:text-gray-300 sm:text-2xl">
          <FaHome />
        </Link>

        {/* Center Title - Hidden on mobile */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <span className={`text-lg sm:text-xl md:text-3xl font-bold tracking-wide ${colors[currentColor]} transition-colors duration-300`}>
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

          {/* Login */}
          <Link to="/login" aria-label="Login" className="flex items-center gap-1 hover:text-gray-300">
            <FaSignInAlt className="text-lg" />
            <span className="hidden sm:inline">Login</span>
          </Link>

          {/* Signup */}
          <Link to="/signup" aria-label="Signup" className="flex items-center gap-1 hover:text-gray-300">
            <FaUserPlus className="text-lg" />
            <span className="hidden sm:inline">Signup</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
