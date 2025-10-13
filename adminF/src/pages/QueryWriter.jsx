import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const QueryWriter = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [query, setQuery] = useState("{}");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/collections`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCollections(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCollections();
  }, []);

  const runQuery = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/query`,
        { collection: selectedCollection, query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to execute query");
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (result.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedCollection);
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${selectedCollection}_query_results.xlsx`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg mt-4">
      <h2 className="text-2xl font-semibold mb-4">MongoDB Query Writer</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          className="border px-2 rounded bg-gray-800 text-white"
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">Select Collection</option>
          {collections.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <textarea
          className="border p-2 rounded flex-1 bg-gray-800 text-white"
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          onClick={runQuery}
          disabled={!selectedCollection || !query || loading}
        >
          {loading ? "Running..." : "Run Query"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {result.length > 0 && (
        <>
          <div className="flex justify-end mb-2">
            <button
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={downloadExcel}
            >
              Download as Excel
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-700 rounded">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-800">
                <tr>
                  {Object.keys(result[0]).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left border-b border-gray-700"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700">
                    {Object.values(item).map((val, i) => (
                      <td key={i} className="px-4 py-2">
                        {typeof val === "object" ? JSON.stringify(val) : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {result.length === 0 && !loading && !error && (
        <p className="text-gray-400 mt-4">No results</p>
      )}
    </div>
  );
};

export default QueryWriter;
