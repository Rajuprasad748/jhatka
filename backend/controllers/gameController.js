// controllers/resultController.js
import mongoose from "mongoose";
import Game from "../models/addGame.js";
import Result from "../models/result.js";
import Bet from "../models/placeBet.js";
import User from "../models/User.js";

const multipliers = {
  singleDigit: 10,
  jodi: 100,
  singlePana: 160,
  doublePana: 320,
  triplePana: 900,
  halfSangam: 1500,
  fullSangam: 10000,
};

const convertToMongoDate = (timeString) => {
  if (!timeString) return null;

  // Already a Date object
  if (timeString instanceof Date) return timeString;

  // If ISO string (e.g., 2025-10-13T13:45:00Z)
  const maybeDate = new Date(timeString);
  if (!isNaN(maybeDate.getTime()) && timeString.includes("T")) {
    return maybeDate;
  }

  // Parse "HH:mm" or "HH:mm AM/PM"
  const parts = timeString.trim().split(" ");
  let timePart = parts[0];
  let meridian = parts[1] ? parts[1].toUpperCase() : null;

  let [hours, minutes] = timePart.split(":").map((s) => parseInt(s, 10));

  if (meridian) {
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
  }

  // Create local date (based on current date)
  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );

  // 🕒 Subtract 5 hours 30 minutes to store UTC equivalent of IST
  date.setHours(date.getHours() - 5);
  date.setMinutes(date.getMinutes() - 30);

  return date;
};

// ✅ Utility: return last digit of sum as string
function getLastDigitSum(arr) {
  if (!Array.isArray(arr)) arr = Array.from(String(arr), Number);
  const sum = arr.reduce((a, b) => a + Number(b), 0);
  return String(sum % 10);
}

// ✅ Extract time from stored date or string → returns "HH:mm AM/PM" in IST
function getTimeOnly(stored) {
  if (!stored) return null;

  const date =
    stored instanceof Date
      ? stored
      : !isNaN(new Date(stored))
      ? new Date(stored)
      : null;

  if (!date) return null;

  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Convert UTC → IST if needed

  let hours = localDate.getHours();
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

// Normalize incoming time payload and convert to Mongo Date in add/update flows.
// Accepts "HH:mm" or "HH:mm AM/PM" or Date/ISO.
const normalizeAndConvertTime = (input) => {
  if (!input) return null;
  // If input looks like a Date object already or ISO string, convert in convertToMongoDate
  return convertToMongoDate(input);
};

// ----------------- Public controllers -----------------

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    if(!games) return res.status(404).json({message : "games not found , try after some time"})
    res.status(200).json(games);
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ error: "Server error while fetching games" });
  }
};


export const getGame = async (req, res) => {

  const { id } = req.params;

  if(!id) return res.status(500).json({ error: "something went wrong Id is missing" });

  try {
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    res.status(200).json(game);
  } catch (error) {
    console.error("❌ Error fetching game:", error);
    res.status(500).json({ error: "Server error while fetching game" });
  }
};

// Update game times — store as Mongo Date (today's date with that time)
export const updateGameTime = async (req, res) => {
  const { selectedGameId } = req.params;
  let { openingTime, closingTime } = req.body;

  if(!selectedGameId || !openingTime || !closingTime){
    return res.status(404).json({ message: "Invalid or missing data" });
  }

  try {
    const game = await Game.findById(selectedGameId);
    if (!game) return res.status(404).json({ message: "Game not found" });


    if (openingTime) {
      game.openingTime = normalizeAndConvertTime(openingTime);
    }
    if (closingTime) {
      game.closingTime = normalizeAndConvertTime(closingTime);
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

// Add game — expects openingTime/closingTime as "HH:mm" or "HH:mm AM/PM" or date-like strings
export const addGame = async (req, res) => {
  const admin = req.admin;

  const allowedRoles = ["superAdmin"];
  if (!allowedRoles.includes(admin.role)) {
    return res
      .status(403)
      .json({ message: "You do not have permission to add tokens" });
  }

  try {
    const {
      name,
      openingTime,
      closingTime,
      openDigits,
      closeDigits,
      showToUsers,
      isPersonal,
    } = req.body;

    if (!name || !openingTime || !closingTime || !openDigits || !closeDigits) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (
      !Array.isArray(openDigits) ||
      openDigits.length !== 3 ||
      !Array.isArray(closeDigits) ||
      closeDigits.length !== 3
    ) {
      return res.status(400).json({
        message: "Open and Close digits must contain exactly 3 numbers.",
      });
    }

    const newGame = new Game({
      name: name.toUpperCase(),
      openingTime: normalizeAndConvertTime(openingTime),
      closingTime: normalizeAndConvertTime(closingTime),
      openDigits,
      closeDigits,
      showToUsers: showToUsers ?? true,
      isPersonal: isPersonal ?? false,
    });

    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (err) {
    console.error("❌ Error saving game:", err);
    res.status(500).json({ message: "Server error. Could not save game." });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const admin = req.admin;
    const { gameId } = req.params;

    if(!admin) return res.status(404).json({ message: "Admin not found" });
    if(!gameId) return res.status(404).json({ message: "game is not found" });

    const allowedRoles = ["superAdmin"];
    if (!allowedRoles.includes(admin.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to add tokens" });
    }
    await Game.findByIdAndDelete(gameId);
    res.status(204).json({message : "Game deleted Succesfully"});
  } catch (err) {
    console.error("Error deleting game:", err);
    res.status(500).json({ message: "Server error. Could not delete game." });
  }
};

// Toggle visibility to users
export const showGamesToUsers = async (req, res) => {
  try {
    const admin = req.admin;
    const { toShow } = req.body;
    const { selectedGame } = req.params;

    if(!selectedGame) return res.status(403).json({ message: "Game is not selected" });

    const allowedRoles = ["superAdmin"];
    if (!allowedRoles.includes(admin.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to add tokens" });
    }


    if (typeof toShow !== "boolean") {
      return res.status(400).json({ error: "toShow must be a boolean" });
    }

    const updatedGame = await Game.findByIdAndUpdate(
      selectedGame,
      { showToUsers: toShow },
      { new: true }
    );
    res.status(200).json(updatedGame);
  } catch (err) {
    console.error("Error updating game visibility:", err);
    res.status(500).json({ error: "Error updating game visibility" });
  }
};

// ----------------- Set result & process bets (merged) -----------------
export const setAndProcessResult = async (req, res) => {
  const admin = req.admin;

  const allowedRoles = ["superAdmin", "betAdmin"];
  if (!allowedRoles.includes(admin.role)) {
    return res
      .status(403)
      .json({ message: "You do not have permission to add tokens" });
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, value } = req.body; // type = "open" | "close"
    const { gameId } = req.params;

    // ✅ Validation
    if (!type || !["open", "close"].includes(type)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid or missing type" });
    }
    if (!value || typeof value !== "string" || value.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid or missing value" });
    }

    const game = await Game.findById(gameId).session(session);
    if (!game) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Game not found" });
    }


    // ✅ Time checking
    const gameTime =
      type === "open"
        ? getTimeOnly(game.openingTime)
        : getTimeOnly(game.closingTime);
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    if (gameTime && currentTime !== gameTime) {
      console.warn(
        `⚠️ Publishing ${type} result at ${currentTime}, scheduled for ${gameTime}`
      );
    }

    // ✅ Prepare digits
    const digits = value.split("").map((d) => Number(d));

    // ✅ Save result
    const resultDoc = new Result({
      gameId: new mongoose.Types.ObjectId(gameId),
      gameName: game.name,
      type,
      value: digits,
      published: true,
      publishedAt: now,
      scheduledTime: now,
    });
    await resultDoc.save({ session });

    // ✅ Update game
    if (type === "open") {
      await Game.findByIdAndUpdate(gameId, { openDigits: digits , openUpdatedAt: new Date()}, { session });
    } else {
      await Game.findByIdAndUpdate(
        gameId,
        { closeDigits: digits , closeUpdatedAt : new Date() },
        { session }
      );
    }

    // ✅ Get results for processing bets
    const openResult =
      type === "open"
        ? resultDoc
        : await Result.findOne({
            gameId,
            type: "open",
            published: true,
          }).session(session);
    const closeResult =
      type === "close"
        ? resultDoc
        : await Result.findOne({
            gameId,
            type: "close",
            published: true,
          }).session(session);

    // ✅ Fetch pending bets
    const bets = await Bet.find({ gameId, status: "pending" }).session(session);
    if (!bets || bets.length === 0) {
      await session.commitTransaction();
      session.endSession();
      return res.json({
        message: "Result declared, no bets to process",
        result: resultDoc,
      });
    }

    const bulkBetOps = [];
    const userIncrements = new Map();

    // 🔹 Helper for PANA logic
    function checkPanaWin(userInput, answer, panaType) {
      if (userInput.length !== 3 || answer.length !== 3) return false;
      let matchedPositions = 0;
      for (let i = 0; i < 3; i++) {
        if (userInput[i] === answer[i]) matchedPositions++;
      }
      if (panaType === "singlePana" || panaType === "doublePana" || panaType === "triplePana") return matchedPositions == 1;
  
      return false;
    }

    // ✅ Process each bet
    for (const bet of bets) {
      // JODI should only be settled on closing result
      if (type === "open" && bet.betType === "jodi") {
        console.log("⏭️ Skipping JODI bet on OPEN result, waiting for CLOSE");
        continue; // ✅ skip only this bet
      }

      let isWinner = false;
      let winningAmount = 0;
      const betDigitsStr = String(bet.digits);

      // SINGLE DIGIT
      if (bet.betType === "singleDigit") {
        const resForMarket =
          bet.marketType === "open" ? openResult : closeResult;
        if (resForMarket) {
          const last = getLastDigitSum(resForMarket.value);
          if (betDigitsStr === last) isWinner = true;
        }
      }

      // JODI
      if (
        type === "close" &&
        bet.betType === "jodi" &&
        openResult &&
        closeResult
      ) {
        const jodi =
          getLastDigitSum(openResult.value) +
          getLastDigitSum(closeResult.value);
        if (betDigitsStr === jodi) isWinner = true;
      }

      // PANA LOGIC
      if (["singlePana", "doublePana", "triplePana"].includes(bet.betType)) {
        const resForMarket =
          bet.marketType === "open" ? openResult : closeResult;
        if (resForMarket) {
          const resultStr = resForMarket.value.join("");
          if (checkPanaWin(betDigitsStr, resultStr, bet.betType)) {
            isWinner = true;
          }
        }
      }

      // HALF SANGAM
      if (bet.betType === "halfSangam" && openResult && closeResult) {
        if (bet.marketType === "open") {
          const openStr = openResult.value.join("");
          const lastClose = getLastDigitSum(closeResult.value);
          if (betDigitsStr === openStr + lastClose) isWinner = true;
        } else if (bet.marketType === "close") {
          const closeStr = closeResult.value.join("");
          const lastOpen = getLastDigitSum(openResult.value);
          if (betDigitsStr === closeStr + lastOpen) isWinner = true;
        }
      }

      // FULL SANGAM
      if (
        type === "close" &&
        bet.betType === "fullSangam" &&
        openResult &&
        closeResult
      ) {
        const openStr = openResult.value.join("");
        const closeStr = closeResult.value.join("");
        if (betDigitsStr === openStr + closeStr) isWinner = true;
      }


      // ✅ Settlement
      if (isWinner) {
        winningAmount =
          (Number(bet.points) || 0) * (multipliers[bet.betType] || 1);
        const userIdStr = String(bet.user);
        userIncrements.set(
          userIdStr,
          (userIncrements.get(userIdStr) || 0) + winningAmount
        );
        bulkBetOps.push({
          updateOne: {
            filter: { _id: bet._id },
            update: { $set: { status: "won", winningAmount } },
          },
        });
      } else {
        bulkBetOps.push({
          updateOne: {
            filter: { _id: bet._id },
            update: { $set: { status: "lost", winningAmount: 0 } },
          },
        });
      }
    }


    // ✅ Bulk update bets
    if (bulkBetOps.length) await Bet.bulkWrite(bulkBetOps, { session });

    // ✅ Bulk update user wallet balances
    if (userIncrements.size > 0) {
      const bulkUserOps = [];
      for (const [userId, amount] of userIncrements.entries()) {
        bulkUserOps.push({
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(userId) },
            update: { $inc: { walletBalance: amount } },
          },
        });
      }
      if (bulkUserOps.length) await User.bulkWrite(bulkUserOps, { session });
    }

    console.log("object of everythih=ng done");

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    console.log("✅ Bets processed successfully");
    console.log("object of the middle session");

    return res.json({
      message: `🎯 ${type.toUpperCase()} result declared and bets processed successfully`,
      result: resultDoc,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error in setAndProcessResult:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get results grouped date-wise (keeps compatibility with existing front-end)
export const getResultsDatewise = async (req, res) => {
  const { gameId } = req.query;
  if (!gameId) {
    return res.status(400).json({ message: "gameId is required" });
  }

  try {
    const results = await Result.aggregate([
      {
        $match: {
          gameId: new mongoose.Types.ObjectId(gameId),
        },
      },
      {
        $addFields: {
          resultDate: {
            $dateToString: { format: "%d-%m-%Y", date: "$scheduledTime" },
          },
        },
      },
      {
        $group: {
          _id: { date: "$resultDate" },
          gameName: { $first: "$gameName" },
          open: {
            $max: {
              $cond: [{ $eq: ["$type", "open"] }, "$value", null],
            },
          },
          close: {
            $max: {
              $cond: [{ $eq: ["$type", "close"] }, "$value", null],
            },
          },
        },
      },
      { $sort: { "_id.date": -1 } },
    ]);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
