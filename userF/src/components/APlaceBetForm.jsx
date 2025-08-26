import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js"; // ✅ import context

const betOptions = [
  { name: "Single Digit", parts: [{ label: "Digits", len: 1 }] },
  { name: "Jodi", parts: [{ label: "Digits", len: 2 }] },
  { name: "Single Pana (A)", parts: [{ label: "Digits", len: 3 }] },
  { name: "Double Pana (AA)", parts: [{ label: "Digits", len: 3 }] },
  { name: "Triple Pana (AAA)", parts: [{ label: "Digits", len: 3 }] },
  { name: "Half Sangam", parts: [{ label: "Open Digit" }, { label: "Close Pana" }] },
  { name: "Full Sangam (XXX-XX-XXX)", parts: [{ label: "First Part", len: 3 }, { label: "Second Part", len: 3 }] },
];

const betTypeMap = {
  "Single Digit": "singleDigit",
  "Jodi": "jodi",
  "Single Pana (A)": "singlePana",
  "Double Pana (AA)": "doublePana",
  "Triple Pana (AAA)": "triplePana",
  "Half Sangam": "halfSangam",
  "Full Sangam (XXX-XX-XXX)": "fullSangam",
};

const APlaceBetForm = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth(); // ✅ get user + updater

  const [selectedOption, setSelectedOption] = useState(betOptions[0].name);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    session: "open",
    digits: {},
    points: "",
  });

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("part-")) {
      const numericValue = value.replace(/\D/g, ""); 
      setFormData({
        ...formData,
        digits: { ...formData.digits, [name]: numericValue },
      });
    } else if (name === "points") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, points: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validation & Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let option = betOptions.find((o) => o.name === selectedOption);

    // 🔹 Special validation for Half Sangam
    if (selectedOption === "Half Sangam") {
      const openLen = formData.session === "open" ? 3 : 1;
      const closeLen = formData.session === "open" ? 1 : 3;

      if (!formData.digits["part-0"] || formData.digits["part-0"].length !== openLen) {
        alert(`Please enter exactly ${openLen} digits for Open Digit`);
        return;
      }
      if (!formData.digits["part-1"] || formData.digits["part-1"].length !== closeLen) {
        alert(`Please enter exactly ${closeLen} digits for Close Pana`);
        return;
      }
    } else {
      // 🔹 Normal validation
      for (let i = 0; i < option.parts.length; i++) {
        const partName = `part-${i}`;
        const requiredLen = option.parts[i].len;
        if (!formData.digits[partName] || formData.digits[partName].length !== requiredLen) {
          alert(`Please enter exactly ${requiredLen} digits for ${option.parts[i].label}`);
          return;
        }
      }
    }

    if (!formData.points) {
      alert("Please enter points");
      return;
    }

    // 🔹 Build payload matching schema
    const payload = {
      user: user?._id, // ✅ logged-in user id
      betType: betTypeMap[selectedOption],
      date: new Date(formData.date),
      marketType: formData.session,
      digits: Object.values(formData.digits).join("-"),
      points: parseInt(formData.points, 10),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/bet/place-bet`,
        payload,
        { withCredentials: true }
      );

      // ✅ update wallet instantly
      if (res.data.walletBalance !== undefined) {
        updateUser({ ...user, walletBalance: res.data.walletBalance });
      }

      alert("Bet submitted successfully!");

      // reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        session: "open",
        digits: {},
        points: "",
      });

      navigate("/");
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("Failed to place bet. Please try again.");
    }
  };

  const currentOption = betOptions.find((o) => o.name === selectedOption);

  // Decide dynamic lengths for Half Sangam
  const getFieldLength = (label) => {
    if (selectedOption === "Half Sangam") {
      if (label === "Open Digit") return formData.session === "open" ? 3 : 1;
      if (label === "Close Pana") return formData.session === "open" ? 1 : 3;
    }
    return currentOption.parts.find((p) => p.label === label)?.len || 1;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-300 shadow-lg rounded-2xl mt-10 sm:mt-20">
      <h2 className="text-xl font-bold mb-4 text-center">Place Your Bet</h2>

      {/* Select Option */}
      <select
        className="w-full p-2 border rounded-lg mb-4"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {betOptions.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Session (hide for Jodi) */}
        {selectedOption !== "Jodi" && (
          <div>
            <label className="block text-sm font-medium">Choose Session</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="session"
                  value="open"
                  checked={formData.session === "open"}
                  onChange={handleChange}
                />
                Open
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="session"
                  value="close"
                  checked={formData.session === "close"}
                  onChange={handleChange}
                />
                Close
              </label>
            </div>
          </div>
        )}

        {/* Dynamic Digits */}
        {currentOption.parts.map((part, index) => {
          const len = getFieldLength(part.label);
          return (
            <div key={index}>
              <label className="block text-sm font-medium">
                {part.label} ({len} digits)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name={`part-${index}`}
                value={formData.digits[`part-${index}`] || ""}
                onChange={handleChange}
                maxLength={len}
                className="w-full p-2 border rounded-lg"
                placeholder={`Enter ${len} digits`}
                required
                autoComplete="off"
              />
            </div>
          );
        })}

        {/* Points */}
        <div>
          <label className="block text-sm font-medium">Points</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter amount"
            required
            autoComplete="off"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default APlaceBetForm;
