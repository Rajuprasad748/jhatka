import React, { useState } from 'react';

const BetForm = () => {
  const [number, setNumber] = useState('');

  const handleNumberChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,8}$/.test(val)) {
      setNumber(val);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm md:max-w-md bg-gray-800 text-white p-6 rounded-2xl border border-gray-700 shadow-lg">
        <form className="flex flex-col gap-6">
          <h1 className="text-xl md:text-2xl font-semibold text-center mb-4">
            Add the Number for the Bet
          </h1>

          {/* Dropdown Field */}
          <label className="relative">
            <select
              required
              className="peer w-full p-4 pt-6 bg-[#2d2d2d] text-white border border-gray-600 rounded-lg outline-none appearance-none"
            >
              <option value="">Select Place</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="chennai">Chennai</option>
              <option value="tamil-nadu">Tamil Nadu</option>
              <option value="mp">Madhya Pradesh</option>
            </select>
            <span className="absolute left-2 top-2 text-sm text-white/60 peer-focus:text-sky-400">
              Place
            </span>
          </label>

          {/* Numeric Field */}
          <label className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={number}
              onChange={handleNumberChange}
              required
              className="peer w-full p-4 pt-6 bg-[#2d2d2d] text-white border border-gray-600 rounded-lg outline-none"
            />
            <span className="absolute left-2 top-2 text-sm text-white/60 peer-focus:text-sky-400">
              Enter Number
            </span>
          </label>

          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-400 text-white text-base py-3 rounded-lg transition font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BetForm;
