import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BetHistory = () => {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get('/api/bets/all'); // Replace with actual API if needed
        setBets(response.data);
      } catch (error) {
        console.error("Failed to fetch bets", error);
      }
    };

    fetchBets();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">All-Time Bet History</h2>

      <div className="overflow-x-auto bg-white rounded-md shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="text-left px-4 py-2">Game Name</th>
              <th className="text-left px-4 py-2">Bet Type</th>
              <th className="text-left px-4 py-2">Number</th>
              <th className="text-left px-4 py-2">Amount</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bets.length > 0 ? (
              bets.map((bet, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-4 py-2">{bet.name}</td>
                  <td className="px-4 py-2 capitalize">{bet.betType}</td>
                  <td className="px-4 py-2 font-mono">{bet.number}</td>
                  <td className="px-4 py-2 text-green-600 font-semibold">₹{bet.amount}</td>
                  <td className="px-4 py-2">{new Date(bet.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No bets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetHistory;
