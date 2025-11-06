import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { betOptions, betTypeMap, getDisabledState } from "../utils/betUtils.js";

const APlaceBetForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const { game } = location.state || {};

  const createEmptyBet = () => ({
    date: new Date().toISOString().split("T")[0],
    session: "open",
    option: betOptions[0].name,
    digits: {},
    points: "",
    disabled: { openDisabled: false, closeDisabled: false }, // per bet disabled
  });

  const [bets, setBets] = useState([createEmptyBet()]);
  const [loading, setLoading] = useState(false);

  // ------------------ Check Disabled ------------------
 const checkDisabled = useCallback(() => {
    if (!game) return;

    setBets(prevBets =>
      prevBets.map(bet => {
        const { openDisabled, closeDisabled, submitDisabled, adjustedOption, session } =
          getDisabledState(game, bet.option, bet.session);

        // if the option was auto-adjusted, clear digits for that bet
        const newOption = adjustedOption || bet.option;
      const newDigits = adjustedOption && adjustedOption !== bet.option ? {} : bet.digits;

        return {
          ...bet,
          session,
          //option: adjustedOption || bet.option,
          option: newOption,          
          digits: newDigits,
          disabled: { openDisabled, closeDisabled, submitDisabled },
        };
      })
    );
  }, [game]);
// ...e
  useEffect(() => {
    checkDisabled();
    const interval = setInterval(checkDisabled, 30000);
    return () => clearInterval(interval);
  }, [checkDisabled]);

  // ------------------ Handle form change ------------------
  const handleChange = (index, field, value) => {
    const updated = [...bets];
    updated[index][field] = value;

    if (field === "option") {
      updated[index].digits = {};
    }

    setBets(updated);
  };

  const handleDigitChange = (index, partIndex, label, session, optionName, val) => {
    const getRequiredLength = (option, label, session) => {
      if (["Single Pana", "Double Pana", "Triple Pana"].includes(option)) return 3;
      if (option === "Jodi") return 2;
      if (option === "Half Sangam") {
        if (label === "Open Digit") return session === "open" ? 3 : 1;
        if (label === "Close Pana") return session === "open" ? 1 : 3;
      }
      if (option === "Full Sangam") return 3;
      return 1;
    };

    const len = getRequiredLength(optionName, label, session);
    const numeric = val.replace(/\D/g, "").slice(0, len);

    const updated = [...bets];
    updated[index].digits[`part-${partIndex}`] = numeric;
    setBets(updated);
  };

  const addBet = () => setBets(prev => [...prev, createEmptyBet()]);
  const removeBet = i => {
    if (bets.length === 1) return toast.error("At least one bet required");
    setBets(prev => prev.filter((_, idx) => idx !== i));
  };

  // ------------------ Validate All Bets ------------------
  const validateAll = () => {
    for (let i = 0; i < bets.length; i++) {
      const bet = bets[i];
      const option = betOptions.find(o => o.name === bet.option);

      // Points
      const pointsValue = parseInt(bet.points, 10);
      if (!pointsValue || pointsValue < 50 || pointsValue > 10000)
        return `Bet #${i + 1}: Points must be 50-10000`;

      // Digits
      for (let p = 0; p < option.parts.length; p++) {
        const partName = `part-${p}`;
        const label = option.parts[p].label;
        const len = (() => {
          if (["Single Pana", "Double Pana", "Triple Pana"].includes(option.name)) return 3;
          if (option.name === "Jodi") return 2;
          if (option.name === "Half Sangam") {
            if (label === "Open Digit") return bet.session === "open" ? 3 : 1;
            if (label === "Close Pana") return bet.session === "open" ? 1 : 3;
          }
          if (option.name === "Full Sangam") return 3;
          return 1;
        })();

        const val = bet.digits[partName];
        if (!val || val.length !== len)
          return `Bet #${i + 1}: Enter exactly ${len} digits for ${label}`;
      }

      // Triple Pana validation
      if (betTypeMap[option.name] === "triplePana") {
        const val = Object.values(bet.digits).join("-");
        if (!(val[0] === val[1] && val[1] === val[2]))
          return `Bet #${i + 1}: All three digits must be same for Triple Pana`;
      }

      // Double Pana validation
      if (betTypeMap[option.name] === "doublePana") {
        const val = Object.values(bet.digits).join("-");
        if (
          !(
            (val[0] === val[1] && val[1] !== val[2]) ||
            (val[1] === val[2] && val[0] !== val[1])
          )
        )
          return `Bet #${i + 1}: Two consecutive digits must be same for Double Pana`;
      }
    }
    return null;
  };

  // ------------------ Submit All Bets ------------------
  const handleSubmit = async () => {
    if (!user?._id) return navigate("/login");

    const err = validateAll();
    if (err) return toast.error(err);

    const payload = bets.map(bet => ({
      user: user._id,
      gameId: game._id,
      betType: betTypeMap[bet.option],
      date: bet.date,
      marketType: bet.session,
      digits: Object.values(bet.digits).join("-"),
      points: parseInt(bet.points, 10),
    }));

    console.log("payload" , payload);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log(token)

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/place-bets`,
        { bets: payload },
        {withCredentials: true},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      updateUser(prev => ({ ...prev, walletBalance: res.data.walletBalance }));
      toast.success("All bets placed successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place bets");
    } finally {
      setLoading(false);
    }
  };

  if (!game) return <p className="text-center text-red-600">No game selected</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="max-w-xl w-full bg-gray-900 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">{game.name} - Multi Bet</h2>

        {bets.map((bet, index) => {
          const option = betOptions.find(o => o.name === bet.option);
          return (
            <div key={index} className="bg-gray-800 p-4 rounded-xl mb-4 space-y-3 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Bet #{index + 1}</p>
                <button onClick={() => removeBet(index)} className="text-red-400 hover:text-red-600 text-xl">❌</button>
              </div>

              {/* Session */}
              {option.name !== "Jodi" && (
                <div className="flex gap-4 mb-2">
                  <label>
                    <input type="radio" value="open" checked={bet.session === "open"}
                      disabled={bet.disabled.openDisabled}
                      onChange={e => handleChange(index, "session", e.target.value)}
                      className="mr-1"
                    />
                    Open
                  </label>
                  <label>
                    <input type="radio" value="close" checked={bet.session === "close"}
                      disabled={bet.disabled.closeDisabled}
                      onChange={e => handleChange(index, "session", e.target.value)}
                      className="mr-1"
                    />
                    Close
                  </label>
                </div>
              )}

              {/* Option */}
              <select className="p-2 w-full text-black rounded"
                value={bet.option}
                onChange={e => handleChange(index, "option", e.target.value)}
              >
                {betOptions.map(o => <option key={o.name}>{o.name}</option>)}
              </select>

              {/* Digits */}
              {option.parts.map((p, idx) => (
                <input
                  key={idx}
                  className="p-2 w-full text-black rounded"
                  placeholder={p.label}
                  value={bet.digits[`part-${idx}`] || ""}
                  onChange={(e) =>
                    handleDigitChange(index, idx, p.label, bet.session, bet.option, e.target.value)
                  }
                />
              ))}

              {/* Points */}
              <input
                type="text"
                className="p-2 w-full text-black rounded"
                placeholder="Points"
                value={bet.points}
                onChange={e => handleChange(index, "points", e.target.value.replace(/\D/g, ""))}
              />
            </div>
          );
        })}

        <div className="flex justify-between">
          <button onClick={addBet} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">➕ Add More Bet</button>
          <button onClick={handleSubmit} disabled={loading}
            className={`bg-green-600 px-4 py-2 rounded hover:bg-green-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Submitting..." : "Submit Bets"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default APlaceBetForm;
