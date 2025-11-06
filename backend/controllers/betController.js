import Bet from "../models/placeBet.js";
import User from "../models/User.js";
import Game from "../models/addGame.js";
import mongoose from "mongoose";

// POST /api/bets
export const placeBets = async (req, res) => {
  try {
    const { bets } = req.body;

    if (!bets || !Array.isArray(bets) || bets.length === 0) {
      return res.status(400).json({ message: "At least one bet is required" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Userrrr not found" });

    // Validate each bet
    let totalPoints = 0;
    for (let i = 0; i < bets.length; i++) {
      const { betType, date, marketType, digits, points, gameId } = bets[i];

      if (!betType || !date || !marketType || !digits || !points || !gameId) {
        return res.status(400).json({ message: `All fields are required for bet #${i + 1}` });
      }

      const pointsNumber = Number(points);
      if (isNaN(pointsNumber) || pointsNumber < 50) {
        return res.status(400).json({ message: `Invalid points for bet #${i + 1}` });
      }

      totalPoints += pointsNumber;
    }

    // Check wallet balance
    if (user.walletBalance < totalPoints) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct total points
    user.walletBalance -= totalPoints;
    await user.save();

    // Save all bets
    const betsToSave = await Promise.all(
      bets.map(async (b) => {
        const game = await Game.findById(b.gameId);
        if (!game) throw new Error(`Game not found for bet: ${b.gameId}`);

        return new Bet({
          user: userId,
          gameId: b.gameId,
          gameName: game.name,
          betType: b.betType,
          date: b.date,
          marketType: b.marketType,
          digits: b.digits,
          points: Number(b.points),
        }).save();
      })
    );

    res.status(201).json({
      message: "All bets placed successfully",
      bets: betsToSave,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("Error placing multiple bets:", error);
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

  const admin = req.admin;

    const allowedRoles = ["superAdmin"];
    if (!allowedRoles.includes(admin.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to add tokens" });
    }

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