import axios from "axios";
import React, { useState } from "react";

const AddGame = () => {
  const [formData, setFormData] = useState({
    name: "",
    openingTime: "",
    closingTime: "",
    openDigits: "",
    closeDigits: "",
    showToUsers: true,
    isPersonal: false,
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value.toUpperCase() // ✅ Always uppercase
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = () => {
    setShowModal(false);

    // ✅ Convert digits properly into an array of numbers
    const formatDigits = (digits) =>
      digits
        .split("")
        .filter((d) => !isNaN(d) && d !== " ") // remove spaces & non-numbers
        .slice(0, 3) // only take first 3 digits
        .map(Number);

    const payload = {
      ...formData,
      openDigits: formatDigits(formData.openDigits),
      closeDigits: formatDigits(formData.closeDigits),
    };

    console.log("Submitting game:", payload);
    try {
      const res = axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/addGame`,
        payload
      );
      console.log(res);
    } catch (error) {
      console.error("Error submitting game:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">➕ Add New Game</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Game Name */}
        <input
          type="text"
          name="name"
          placeholder="Game Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          required
        />

        {/* Opening Time */}
        <input
          type="time"
          name="openingTime"
          value={formData.openingTime}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          required
        />

        {/* Closing Time */}
        <input
          type="time"
          name="closingTime"
          value={formData.closingTime}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          required
        />

        {/* Open Digits */}
        <input
          type="text"
          name="openDigits"
          placeholder="Open Digits (3 digits like 123)"
          value={formData.openDigits}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          maxLength={3}
          required
        />

        {/* Close Digits */}
        <input
          type="text"
          name="closeDigits"
          placeholder="Close Digits (3 digits like 456)"
          value={formData.closeDigits}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
          maxLength={3}
          required
        />

        {/* Show To Users */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="showToUsers"
            checked={formData.showToUsers}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span>Show to Users</span>
        </label>

        {/* Personal Game */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPersonal"
            checked={formData.isPersonal}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span>Personal Game</span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {/* ✅ Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
            <p className="mb-6">Are you sure you want to add this game?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddGame;
