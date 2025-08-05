import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const APlaceBetForm = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const presetAmounts = [10, 50, 100, 500];
  const navigate = useNavigate();

  const handlePresetClick = (val) => {
    setAmount(val.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ selectedGame, number, amount });
    navigate('/');
  };

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-md mx-auto mt-6 mb-10 bg-slate-300 rounded-2xl shadow-md">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6 text-gray-800">
        Place Your Bet
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Game Dropdown */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Game</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="" disabled>Select a game</option>
            {[
              'Kalyan Matka Bhopal',
              'Sita Morning Bhopal',
              'Sridevi Morning Bhopal',
              'Karnataka Day',
              'Tulsi Morning',
              'Milan Bazar',
              'Khatri Morning',
              'Rajdhani Night',
            ].map((game) => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>

        {/* Enter Number */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Number (0-9)</label>
          <input
            type="text"
            maxLength="1"
            pattern="[0-9]"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Amount Field */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Amount</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {presetAmounts.map((amt) => (
              <button
                type="button"
                key={amt}
                className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                onClick={() => handlePresetClick(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={!selectedGame || !number || !amount}
        >
          Place Bet
        </button>
      </form>
    </div>
  );
};

export default APlaceBetForm;
