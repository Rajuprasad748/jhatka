import Bet from "../models/placeBet.js";
import User from "../models/User.js";
import Game from "../models/addGame.js";

// POST /api/bets
export const placeBet = async (req, res) => {
  try {
    const { betType, date, marketType, digits, points, gameId } = req.body;

    // Basic validation
    if (!betType || !date || !marketType || !digits || !points || !gameId ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // user is injected from verifyToken middleware
    const userId = req.user._id;

    console.log("object of userId", userId);

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
    const userId = req.user.id;

    // ✅ Fetch bets for the user
    const bets = await Bet.find({ user: userId }).populate("gameId", "name");

    res.status(200).json(bets);
  } catch (error) {
    console.error("Error fetching bet history:", error);
    res.status(500).json({ message: "Server error" });
  }
};