import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminUpdateContact = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [selectedField, setSelectedField] = useState("contactNumber");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current contact info
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/contactInfo`,
          { withCredentials: true }
        );
        setContactInfo(res.data[0]);
        setValue(res.data[0]?.[selectedField] || "");
      } catch (err) {
        setError(`Failed to fetch contact info: ${err.message}`);
      } finally {
        setFetching(false);
      }
    };
    fetchContactInfo();
  }, [selectedField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
       await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin/updateContactInfo`,
        { field: selectedField, value },
        {
          withCredentials: true,headers: {
      Authorization: `Bearer ${token}`, // 🔥 sending manually
    },
        }
      );

      setSuccess(`${selectedField} updated successfully!`);
      setContactInfo((prev) => ({ ...prev, [selectedField]: value }));
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // 🦴 Skeleton Loader
  if (fetching) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl space-y-4 animate-pulse">
        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        Update Contact Info
      </h2>

      <label className="block mb-2 font-semibold text-gray-700">
        Select Field:
      </label>
      <select
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="contactNumber">Contact Number</option>
        <option value="email">Email</option>
        <option value="telegram">Telegram</option>
        <option value="instagram">Instagram</option>
      </select>

      <label className="block mb-2 font-semibold text-gray-700">
        New Value:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder={`Enter new ${selectedField}`}
      />

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      {success && <p className="text-green-600 mb-2 text-sm">{success}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Updating..." : "Update"}
      </button>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-2 text-gray-800">Current Info:</h3>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          <li>Contact Number: {contactInfo.contactNumber}</li>
          <li>Email: {contactInfo.email}</li>
          <li>Telegram: {contactInfo.telegram}</li>
          <li>Instagram: {contactInfo.instagram}</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminUpdateContact;
