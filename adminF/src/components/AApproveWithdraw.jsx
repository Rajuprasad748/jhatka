// AApproveWithdraw.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AApproveWithdraw({ adminId }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('/api/withdrawals')
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/withdraw/${id}`, {
        status,
        adminId,
      });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status } : req
        )
      );
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Withdrawal Requests</h2>
      <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
        <table className="w-full table-auto text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border">#</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">UPI</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req._id} className="bg-white hover:bg-gray-50 transition">
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border break-all">{req.userId}</td>
                <td className="p-2 border text-center">₹{req.amount}</td>
                <td className="p-2 border break-all">{req.upiId}</td>
                <td className="p-2 border capitalize text-center">{req.status}</td>
                <td className="p-2 border text-center flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => updateStatus(req._id, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req._id, 'rejected')}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AApproveWithdraw;
