import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/account`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching account data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const downloadExcel = () => {
    if (transactions.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Account Transactions");
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `account_transactions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // ✅ Skeleton row
  const SkeletonRow = () => (
    <tr className="animate-pulse bg-gray-800">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-2">
          <div className="h-4 bg-gray-600 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Account Transactions</h2>
        <button
          onClick={downloadExcel}
          disabled={transactions.length === 0}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-700 rounded ">
        <table className="w-full table-auto text-center">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 border-b border-gray-700 text-left">#</th>
              <th className="px-4 py-2 border-b border-gray-700 text-left">Date</th>
              <th className="px-4 py-2 border-b border-gray-700 text-left">Token Added</th>
              <th className="px-4 py-2 border-b border-gray-700 text-left">Withdraw Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx, index) => (
                  <tr key={tx._id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{formatDate(tx.date)}</td>
                    <td className="px-4 py-2 text-green-400 font-medium">{tx.tokenAdded ?? 0}</td>
                    <td className="px-4 py-2 text-red-400 font-medium">{tx.withdrawAmount ?? 0}</td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Account;
