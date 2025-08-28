import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { betOptions, betTypeMap, getDisabledState } from "../utils/betUtils.js";

const APlaceBetForm = () => {
  const location = useLocation();
  const { game } = location.state || {};
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [selectedOption, setSelectedOption] = useState(betOptions[0].name);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    session: "open",
    digits: {},
    points: "",
  });
  const [disabled, setDisabled] = useState({
    openDisabled: false,
    closeDisabled: false,
    submitDisabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentOption = betOptions.find((o) => o.name === selectedOption);

  // ------------------ Check Disabled ------------------
  const checkDisabled = useCallback(() => {
    if (!game) return;
    const { openDisabled, closeDisabled, submitDisabled, adjustedOption, session } =
      getDisabledState(game, selectedOption, formData.session);

    setDisabled({ openDisabled, closeDisabled, submitDisabled });
    setSelectedOption(adjustedOption);
    setFormData((prev) => ({ ...prev, session }));
  }, [game, selectedOption, formData.session]);

  useEffect(() => {
    checkDisabled();
    const interval = setInterval(checkDisabled, 30000);
    return () => clearInterval(interval);
  }, [checkDisabled]);

  // ------------------ Input Change ------------------
  const getFieldLength = (label) => {
    if (selectedOption === "Half Sangam") {
      if (label === "Open Digit") return formData.session === "open" ? 3 : 1;
      if (label === "Close Pana") return formData.session === "open" ? 1 : 3;
    }
    return currentOption.parts.find((p) => p.label === label)?.len || 1;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("part-")) {
      const len = getFieldLength(currentOption.parts[parseInt(name.split("-")[1])].label);
      const numericValue = value.replace(/\D/g, "").slice(0, len);
      setFormData((prev) => ({
        ...prev,
        digits: { ...prev.digits, [name]: numericValue },
      }));
    } else if (name === "points") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, points: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  // ------------------ Submit ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled.submitDisabled) return;

    const pointsValue = parseInt(formData.points, 10);
    if (!pointsValue || pointsValue < 10 || pointsValue > 10000) {
      setError("Points must be between 10 and 10,000");
      return;
    }
    setError("");

    const option = betOptions.find((o) => o.name === selectedOption);

    // Digit Validation
    if (selectedOption === "Half Sangam") {
      const openLen = formData.session === "open" ? 3 : 1;
      const closeLen = formData.session === "open" ? 1 : 3;

      if (!formData.digits["part-0"] || formData.digits["part-0"].length !== openLen) {
        setError(`Enter exactly ${openLen} digits for Open Digit`);
        return;
      }
      if (!formData.digits["part-1"] || formData.digits["part-1"].length !== closeLen) {
        setError(`Enter exactly ${closeLen} digits for Close Pana`);
        return;
      }
    } else {
      for (let i = 0; i < option.parts.length; i++) {
        const partName = `part-${i}`;
        const requiredLen = option.parts[i].len;
        if (!formData.digits[partName] || formData.digits[partName].length !== requiredLen) {
          setError(`Enter exactly ${requiredLen} digits for ${option.parts[i].label}`);
          return;
        }
      }
    }

    const payload = {
      user: user?._id,
      gameId: game._id,
      betType: betTypeMap[selectedOption],
      date: new Date(formData.date),
      marketType: formData.session,
      digits: Object.values(formData.digits).join("-"),
      points: pointsValue,
    };

    console.log("payload", payload);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/place-bet`,
        payload,
        { withCredentials: true }
      );

      if (res.data.walletBalance !== undefined) {
        updateUser((prev) => ({ ...prev, walletBalance: res.data.walletBalance }));
      }
      alert("Bet submitted successfully!");
      setFormData({ date: new Date().toISOString().split("T")[0], session: "open", digits: {}, points: "" });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bet. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!game) {
    return (
      <div className="max-w-xs sm:max-w-md mx-auto p-6 bg-white shadow-xl rounded-3xl mt-10 sm:mt-20 text-center">
        <p className="font-semibold text-red-600">No game selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-xl rounded-3xl p-6 sm:p-8">
        <h2 className="text-center font-bold text-2xl sm:text-3xl mb-6 text-gray-800">{game.name} - Place Bet</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Session */}
          <div className="flex gap-6 justify-center mb-4">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="session"
                value="open"
                checked={formData.session === "open"}
                disabled={disabled.openDisabled}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600"
              />
              Open
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="session"
                value="close"
                checked={formData.session === "close"}
                disabled={disabled.closeDisabled}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600"
              />
              Close
            </label>
          </div>

          {/* Bet Type */}
          <select
            name="betOption"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {betOptions.map((opt) => (
              <option
                key={opt.name}
                value={opt.name}
                disabled={
                  disabled.openDisabled &&
                  ["jodi", "half sangam", "full sangam"].some(
                    (o) => o.toLowerCase() === opt.name.toLowerCase()
                  )
                }
              >
                {opt.name}
              </option>
            ))}
          </select>

          {/* Digits Input */}
          {currentOption.parts.map((part, idx) => (
            <input
              key={idx}
              type="text"
              name={`part-${idx}`}
              value={formData.digits[`part-${idx}`] || ""}
              onChange={handleChange}
              placeholder={part.label}
              className="p-3 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          {/* Points Input */}
          <input
            type="text"
            name="points"
            value={formData.points}
            onChange={handleChange}
            placeholder="Points (10-10000)"
            className="p-3 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Error */}
          {error && <p className="text-red-600 text-center mt-1">{error}</p>}

          {/* Submit */}
          {disabled.submitDisabled ? (
            <p className="text-center text-red-600 font-semibold mt-4">Closed for today</p>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-2xl font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Placing Bet...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default APlaceBetForm;
