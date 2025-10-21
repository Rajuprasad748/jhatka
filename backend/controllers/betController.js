import Bet from "../models/placeBet.js";
import User from "../models/User.js";
import Game from "../models/addGame.js";
import mongoose from "mongoose";

// POST /api/bets
export const placeBet = async (req, res) => {
  try {
    const { betType, date, marketType, digits, points, gameId } = req.body;

    // Basic validation
    if (!betType || !date || !marketType || !digits || !points || !gameId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // user is injected from verifyToken middleware
    const userId = req.user._id;

    // ✅ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // ✅ Check wallet balance
    const pointsNumber = Number(points); // ensure number
    if (user.walletBalance < pointsNumber) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    user.walletBalance -= pointsNumber;
    await user.save();

    /*
    console.log("Bet placed:123", userId, gameId, game.name, betType, date, marketType, digits, points);
    */

    // ✅ Save bet
    const newBet = new Bet({
      user: userId,
      gameId,
      gameName: game.name,
      betType,
      date,
      marketType,
      digits,
      points,
    });

    await newBet.save();

    res.status(201).json({
      message: "Bet placed successfully",
      bet: newBet,
      walletBalance: user.walletBalance, // ✅ return updated wallet balance
    });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBetHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.query.userId; // Support both user and admin routes

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Fetch bets for the user
    const bets = await Bet.find({ user: userId }).populate("gameId", "name");

    res.status(200).json(bets);
  } catch (error) {
    console.error("Error fetching bet history:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserBetHistory = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Fetch bets for the user
    const bets = await Bet.find({ user: userId }).populate("gameId", "name");

    res.status(200).json(bets);
  } catch (error) {
    console.error("Error fetching bet history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBets = async (req, res) => {
  try {
    const bets = await Bet.find().populate("user", "mobile name").populate("gameId", "name").sort({ createdAt: -1 });;
    res.status(200).json(bets);
  } catch (error) {
    console.log(error.message);
  }
};


export const recallResults = async (req , res) => {
  const { date, gameId, marketType } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch all bets for the game/date/market type
    const bets = await Bet.find({
      gameId,
      marketType,
      date: new Date(date), // exactly that date
      status: { $in: ["won", "lost"] },
    }).session(session);

    for (let bet of bets) {
      const user = await User.findById(bet.user).session(session);
      if (!user) continue;

      if (bet.status === "won") {

        user.walletBalance -= bet.winningAmount;
        // Refund bet points
        bet.status = "pending";
      } else if (bet.status === "lost") {
        // User previously lost → refund bet points
        bet.status = "pending"; // or "refunded"
      }

      await user.save({ session });
      await bet.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({
       success: true, message: "Results recalled successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error recalling results:", error);
    return { success: false, message: error.message };
  }
};