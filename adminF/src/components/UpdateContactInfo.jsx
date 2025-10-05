import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminUpdateContact = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [selectedField, setSelectedField] = useState("contactNumber");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
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
        console.log(res.data);
        setContactInfo(res.data[0]);
        setValue(res.data[selectedField] || "");
      } catch (err) {
        setError(`Failed to fetch contact info: ${err.message}`);
      }
    };
    fetchContactInfo();
  }, [selectedField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin/updateContactInfo`,
        { field: selectedField, value },
        { withCredentials: true }
      );

      console.log(`object`, res.data);

      setSuccess(`${selectedField} updated successfully!`);
      setContactInfo((prev) => ({ ...prev, [selectedField]: value }));
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!contactInfo) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Update Contact Info</h2>

      <label className="block mb-2 font-semibold">Select Field:</label>
      <select
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
      >
        <option value="contactNumber">Contact Number</option>
        <option value="email">Email</option>
        <option value="telegram">Telegram</option>
        <option value="instagram">Instagram</option>
      </select>

      <label className="block mb-2 font-semibold">New Value:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
        placeholder={`Enter new ${selectedField}`}
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Updating..." : "Update"}
      </button>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Current Info:</h3>
        <ul className="list-disc list-inside">
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
