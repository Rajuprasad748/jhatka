import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

function Header() {
  const colors = [
    'text-red-500',
    'text-yellow-400',
    'text-green-500',
    'text-blue-500',
    'text-pink-500',
    'text-purple-500',
    'text-orange-400',
    'text-emerald-400',
    'text-indigo-400',
  ];
  const [currentColor, setCurrentColor] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prevIndex) => (prevIndex + 1) % colors.length);
    }, 500);
    return () => clearInterval(interval);
  }, [colors.length]);

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
          <span className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider ${colors[currentColor]} transition-colors duration-300`}>
            RoyalMoney9x
          </span>
        </div>

        {/* Logout Button */}
        <button
          className="text-white text-sm sm:text-base p-2 px-3 bg-red-600 hover:bg-red-700 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
