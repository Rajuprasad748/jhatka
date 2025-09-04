import React from "react";
import { useAuth } from "../context/useAuth";
import { FaUser } from "react-icons/fa";

const UserCard = () => {
  const { user } = useAuth();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user._id);
    alert("User ID copied!");
  };

  return (
    <div className="max-w-sm w-full mx-auto px-4 mt-10 sm:mt-16">
      <div
        className="
          bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center
          transition-all duration-300 hover:shadow-2xl cursor-pointer
        "
      >
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full shadow-md mb-5 flex items-center justify-center 
                     text-4xl bg-indigo-600 text-white"
        >
          <FaUser />
        </div>

        {/* User Name */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {user.name}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {user.email}
        </p>

        {/* Info Section */}
        <div className="w-full space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-semibold">User ID:</span>
            <span className="truncate max-w-[160px]">{user._id}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-semibold">Mobile:</span>
            <span>{user.mobile}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-semibold">Wallet Balance:</span>
            <span className="text-green-600 font-bold">
              ₹{user.walletBalance}
            </span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="mt-6 text-sm sm:text-base text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg 
                     hover:bg-indigo-600 hover:text-white transition-colors duration-300"
        >
          Copy User ID
        </button>
      </div>
    </div>
  );
};

export default UserCard;
