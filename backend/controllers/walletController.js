
import { findUserById } from "../services/user.services.js";
import User from "../models/User.js";

// Add tokens to wallet
export const addTokens = async (req, res) => {
  const { userId } = req.params;
  console.log("userId123" , userId);
  try {
    const { tokens } = req.body;

    console.log("tokens2" , tokens);

    if (!tokens || tokens <= 0) {
      return res.status(400).json({ message: "Tokens must be a positive number" });
    }

    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.walletBalance += Number(tokens);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const removeTokens = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tokens } = req.body;

    if (!tokens || tokens <= 0) {
      return res.status(400).json({ message: "Tokens must be a positive number" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < tokens) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct tokens
    user.walletBalance -= Number(tokens);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
