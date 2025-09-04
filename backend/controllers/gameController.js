// controllers/resultController.js
import Game from "../models/addGame.js";
import Result from "../models/result.js";
import Bet from "../models/placeBet.js";
import User from "../models/User.js";

const multipliers = {
  singleDigit: 9,
  jodi: 90,
  singlePana: 160,
  doublePana: 320,
  triplePana: 900,
  halfSangam: 1500,
  fullSangam: 90000,
};

// Utility: sum last digit
function getLastDigitSum(arr) {
  return (arr.reduce((a, b) => a + b, 0) % 10).toString();
}

const formatTime = (timeString) => {
  const [time, meridian] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  // Pad hours with leading zero if needed
  hours = hours.padStart(2, "0");

  return `${hours}:${minutes} ${meridian.toUpperCase()}`;
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
export const getGame = async (req, res) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);
    console.log("findGame", game)
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (error) {
    console.error("❌ Error fetching game:", error);
    res.status(500).json({ error: "Server error while fetching game" });
  }
};



export const updateGameTime = async (req, res) => {
  const { selectedGameId } = req.params;
  let { openingTime, closingTime } = req.body;

  try {
    const game = await Game.findById(selectedGameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Update whichever time is provided
    if (openingTime) {
      game.openingTime = formatTime(openingTime);
    }
    if (closingTime) {
      game.closingTime = formatTime(closingTime);
    }

    await game.save();

    res.json({
      message: "Game time updated successfully",
      game,
    });
  } catch (error) {
    console.error("❌ Error updating game time:", error);
    res.status(500).json({ error: "Server error while updating game time" });
  }
};

// --------------------
// ADMIN DECLARES RESULT
// --------------------
export const setResult = async (req, res) => {
  function parseTimeToToday(timeString) {
    const [time, modifier] = timeString.split(" ");
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

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    let scheduledTime;
    if (type === "open") scheduledTime = parseTimeToToday(game.openingTime);
    else if (type === "close")
      scheduledTime = parseTimeToToday(game.closingTime);
    else return res.status(400).json({ message: "Invalid type" });

    const digits = value.split("").map(Number);

    const result = new Result({
      gameId,
      gameName: game.name,
      type,
      value: digits,
      scheduledTime,
      published: false, // scheduler will publish later
    });

    await result.save();

    res.json({ message: "Result scheduled successfully", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------
// PRIVATE: PROCESS BETS
// --------------------
export async function processBets(gameId, type) {
  try {
    // fetch the relevant result that just got published
    const result = await Result.findOne({ gameId, type, published: true });

    console.log("process bet result", result);

    if (!result) {
      console.log(
        `⚠️ No ${type.toUpperCase()} result found for game ${gameId}`
      );
      return;
    }

    // also fetch the opposite result if needed (for jodi, sangam)
    const openResult =
      type === "open"
        ? result
        : await Result.findOne({ gameId, type: "open", published: true });
    const closeResult =
      type === "close"
        ? result
        : await Result.findOne({ gameId, type: "close", published: true });

    // only pending bets for this game
    const bets = await Bet.find({ gameId, status: "pending" });

    console.log("bets", bets);

    for (let bet of bets) {
      console.log("bet loop", bet);
      let isWinner = false;
      let winningAmount = 0;

      // ---------- SINGLE DIGIT ----------
      if (bet.betType === "singleDigit") {
        if (bet.marketType === "open" && openResult) {
          const last = getLastDigitSum(openResult.value);
          if (bet.digits == last) isWinner = true;
        }
        if (bet.marketType === "close" && closeResult) {
          const last = getLastDigitSum(closeResult.value);
          if (bet.digits == last) isWinner = true;
        }
      }

      // ---------- JODI ----------
      if (bet.betType === "jodi" && openResult && closeResult) {
        const jodi =
          getLastDigitSum(openResult.value).toString() +
          getLastDigitSum(closeResult.value).toString();

        if (bet.digits === jodi) isWinner = true;
      }

      // ---------- SINGLE / DOUBLE / TRIPLE PANA ----------
      if (["singlePana", "doublePana", "triplePana"].includes(bet.betType)) {
  const res = bet.marketType === "open" ? openResult : closeResult;
  if (res) {
    const resultStr = result.value.join("");

    if (bet.betType === "singlePana") {
      // check if result contains the digit anywhere
      if (resultStr.includes(bet.digits.toString())) {
        isWinner = true;
      }
    }

    if (bet.betType === "doublePana") {
      // check if the result contains the two-digit sequence
      if (resultStr.includes(bet.digits.toString())) {
        isWinner = true;
      }
    }

    if (bet.betType === "triplePana") {
      // check if all digits are equal and match user input
      if (
        resultStr.length === 3 &&
        resultStr.split("").every((d) => d === resultStr[0]) &&
        resultStr === bet.digits.toString()
      ) {
        isWinner = true;
      }
    }
  }
}


      // ---------- HALF SANGAM ----------
      if (bet.betType === "halfSangam" && openResult && closeResult) {
        if (bet.marketType === "open") {
          const openStr = [...openResult.value].sort((a, b) => a - b).join("");
          const lastClose = getLastDigitSum(closeResult.value);
          if (bet.digits === openStr + lastClose) isWinner = true;
        }
        if (bet.marketType === "close") {
          const closeStr = [...closeResult.value]
            .sort((a, b) => a - b)
            .join("");
          const lastOpen = getLastDigitSum(openResult.value);
          if (bet.digits === closeStr + lastOpen) isWinner = true;
        }
      }

      // ---------- FULL SANGAM ----------
      if (bet.betType === "fullSangam" && openResult && closeResult) {
        const openStr = [...openResult.value].sort((a, b) => a - b).join("");
        const closeStr = [...closeResult.value].sort((a, b) => a - b).join("");
        if (bet.digits === openStr + closeStr) isWinner = true;
      }

      console.log("before if" , isWinner);

      // ---------- SETTLEMENT ----------
      if (isWinner) {
              console.log("after if" , isWinner);

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
      console.log("last bet" , bet)
      await bet.save();
    }

    console.log(
      `🎯 Bets processed successfully for game ${gameId} (${type.toUpperCase()})`
    );
  } catch (err) {
    console.error("❌ Error in processBets:", err.message);
    console.log("error gameController")
  }
}
