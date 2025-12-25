import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
const QueryWriter = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [mode, setMode] = useState("find"); // "find" | "aggregate"
  const [input, setInput] = useState("{ }");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch all collection names
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/collections`,
          { headers: { Authorization: `Bearer ${token}` } },
          {withCredentials: true}
        );
        setCollections(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCollections();
  }, []);

  // ✅ Run query or aggregation
  const runQuery = async () => {
    if (!selectedCollection) {
      setError("Please select a collection");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if(!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      };
      const parsedInput = JSON.parse(input);

      const payload =
        mode === "find"
          ? {
              collection: selectedCollection,
              query: parsedInput.query || parsedInput || {},
              lookup: parsedInput.lookup,
              project: parsedInput.project,
            }
          : {
              collection: selectedCollection,
              aggregate: parsedInput.aggregate || parsedInput,
            };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/query`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },{
          withCredentials: true,
        }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid query or server error");
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download Excel
  const downloadExcel = () => {
    if (result.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedCollection);
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${selectedCollection}_results_${new Date().toLocaleDateString('en-GB').replace(/\//g,'-')}.xlsx`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        MongoDB Query & Aggregation Runner
      </h2>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            mode === "find" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setMode("find")}
        >
          Simple Query
        </button>
        <button
          className={`px-4 py-2 rounded ${
            mode === "aggregate" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setMode("aggregate")}
        >
          Aggregation Pipeline
        </button>
      </div>

      {/* Input Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          className="border px-2 py-2 rounded bg-gray-800 text-white min-w-[200px]"
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

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          onClick={runQuery}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Query"}
        </button>
      </div>

      {/* Input JSON */}
      <textarea
        className="border p-3 rounded bg-gray-800 text-white w-full font-mono"
        rows={mode === "find" ? 6 : 10}
        placeholder={
          mode === "find"
            ? '{ "query": {}, "lookup": {}, "project": {} }'
            : '[{ "$match": {} }, { "$lookup": {} }, { "$project": {} }]'
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Results */}
      {result.length > 0 && (
        <>
          <div className="flex justify-between items-center mt-6 mb-2">
            <h3 className="text-lg font-medium">Results ({result.length})</h3>
            <button
              className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 transition"
              onClick={downloadExcel}
            >
              Download Excel
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-800">
                <tr>
                  {Object.keys(result[0]).map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left border-b border-gray-700"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    {Object.values(item).map((val, i) => (
                      <td key={i} className="px-3 py-2 align-top">
                        {typeof val === "object"
                          ? JSON.stringify(val, null, 2)
                          : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && result.length === 0 && !error && (
        <p className="text-gray-400 mt-4 text-center">No results</p>
      )}
    </div>
  );
};

export default QueryWriter;
