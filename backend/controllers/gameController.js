import Game from "../models/addGame.js";
import Result from "../models/result.js";
import Bet from "../models/placeBet.js";

const multipliers = {
  "Single Digit": 9,
  "Jodi": 90,
  "Single Pana": 160,
  "Double Pana": 320,
  "Triple Pana": 900,
  "Half Sangam": 1500,
  "Full Sangam": 90000,
};


export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ error: "Server error while fetching games" });
  }
};

export const setResult = async (req, res) => {
  function parseTimeToToday(timeString) {
    // Example: "05:00 PM"
    const [time, modifier] = timeString.split(" "); // ["05:00", "PM"]
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
  }

  try {
    const { type, value } = req.body;
    const { gameId } = req.params;

    console.log(type, value, gameId);

    // Find game to get its open/close time
    const game = await Game.findById(gameId);
    console.log(game);
    if (!game) return res.status(404).json({ message: "Game not found" });

    let scheduledTime;
    if (type === "open") scheduledTime = parseTimeToToday(game.openingTime);
    else if (type === "close")
      scheduledTime = parseTimeToToday(game.closingTime);
    else return res.status(400).json({ message: "Invalid type" });

    console.log("openingTime:", game.openingTime);
    console.log("closingTime:", game.closingTime);
    console.log("scheduledTime after conversion:", scheduledTime);

    console.log("before creating result");

    const digits = value.split("").map(Number);
    console.log(digits);

    const result = new Result({
      gameId,
      gameName: game.name,
      type,
      value: digits,
      scheduledTime,
      published: false, // will be true only after scheduledTime
    });

    await result.save();

    console.log("result created:", result);

    res.json({ message: "Result scheduled successfully", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


function getLastDigitSum(arr) {
  return (arr.reduce((a, b) => a + b, 0) % 10).toString();
}

export const updateResult = async (req, res) => {
  try {
    const { gameId } = req.params;

    // 1. fetch all results (open + close) for a game
    const results = await Result.find({ gameId });
    const openResult = results.find((r) => r.type === "open");
    const closeResult = results.find((r) => r.type === "close");

    if (!openResult && !closeResult) {
      return res.status(404).json({ message: "No results found for game" });
    }

    // 2. filter results that are published (time passed)
    const visibleResults = results.filter(
      (r) => new Date() >= new Date(r.scheduledTime)
    );

    // 3. Process bets for this game
    const bets = await Bet.find({ gameId, status: "pending" });

    for (let bet of bets) {
      let isWinner = false;
      let winningAmount = 0;

      // -------------------------
      // 🎯 CHECK CONDITIONS
      // -------------------------
      if (bet.betType === "singleDigit") {
        if (bet.marketType === "open" && openResult) {
          const last = getLastDigitSum(openResult.value);
          if (bet.digits === last) isWinner = true;
        }
        if (bet.marketType === "close" && closeResult) {
          const last = getLastDigitSum(closeResult.value);
          if (bet.digits === last) isWinner = true;
        }
      }

      if (bet.betType === "jodi" && openResult && closeResult) {
        const jodi =
          getLastDigitSum(openResult.value) + getLastDigitSum(closeResult.value);
        if (bet.digits === jodi) isWinner = true;
      }

      if (bet.betType === "singlePana") {
        const res = bet.marketType === "open" ? openResult : closeResult;
        if (res) {
          const resStr = [...res.value].sort((a, b) => a - b).join("");
          if (bet.digits === resStr) isWinner = true;
        }
      }

      if (bet.betType === "doublePana") {
        const res = bet.marketType === "open" ? openResult : closeResult;
        if (res) {
          const sorted = [...res.value].sort((a, b) => a - b).join("");
          // double pana means exactly 2 digits same
          const set = new Set(res.value);
          if (set.size === 2 && bet.digits === sorted) isWinner = true;
        }
      }

      if (bet.betType === "triplePana") {
        const res = bet.marketType === "open" ? openResult : closeResult;
        if (res) {
          const sorted = [...res.value].sort((a, b) => a - b).join("");
          const set = new Set(res.value);
          if (set.size === 1 && bet.digits === sorted) isWinner = true;
        }
      }

      if (bet.betType === "halfSangam" && openResult && closeResult) {
        if (bet.marketType === "open") {
          const openStr = [...openResult.value].sort((a, b) => a - b).join("");
          const lastClose = getLastDigitSum(closeResult.value);
          const combo = openStr + lastClose;
          if (bet.digits === combo) isWinner = true;
        }
        if (bet.marketType === "close") {
          const closeStr = [...closeResult.value].sort((a, b) => a - b).join("");
          const lastOpen = getLastDigitSum(openResult.value);
          const combo = closeStr + lastOpen;
          if (bet.digits === combo) isWinner = true;
        }
      }

      if (bet.betType === "fullSangam" && openResult && closeResult) {
        const openStr = [...openResult.value].sort((a, b) => a - b).join("");
        const closeStr = [...closeResult.value].sort((a, b) => a - b).join("");
        const combo = openStr + closeStr;
        if (bet.digits === combo) isWinner = true;
      }

      // -------------------------
      // 🎯 PAYOUT
      // -------------------------
      if (isWinner) {
        winningAmount = bet.points * (multipliers[bet.betType] || 1);
        await User.findByIdAndUpdate(bet.user, {
          $inc: { walletBalance: winningAmount },
        });

        bet.status = "won";
        bet.winningAmount = winningAmount;
      } else {
        bet.status = "lost";
        bet.winningAmount = 0;
      }

      await bet.save();
    }

    // 4. mark results as published
    for (let result of visibleResults) {
      result.published = true;
      await result.save();
    }

    res.json({
      message: "✅ Results processed & bets settled successfully",
      results: visibleResults,
    });
  } catch (err) {
    console.error("❌ Error in updateResult:", err);
    res.status(500).json({ message: err.message });
  }
};