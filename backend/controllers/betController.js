import Bet from "../models/placeBet.js";
import User from "../models/User.js";

// POST /api/bets
export const placeBet = async (req, res) => {
  try {
    const { betType, date, marketType, digits, points } = req.body;

    // Basic validation
    if (!betType || !date || !marketType || !digits || !points) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // user is injected from verifyToken middleware
    const userId = req.user.id;

    // ✅ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check wallet balance
    if (user.walletBalance < points) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // ✅ Deduct points from wallet
    user.walletBalance -= points;
    await user.save();

    // ✅ Save bet
    const newBet = new Bet({
      user: userId,
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
