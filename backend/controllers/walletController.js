import User from "../models/User.js";
import Token from "../models/token.model.js";

export const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find() // only add tokens
      .populate("userId", "name mobile") // get username + mobile
      .sort({ time: -1 });
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add tokens to wallet
export const addTokens = async (req, res) => {
  const { mobile } = req.params;
  console.log("userId123", mobile);
  try {
    const { tokens , remark } = req.body;

    console.log("tokens2", tokens);

    if (!tokens || tokens <= 0) {
      return res
        .status(400)
        .json({ message: "Tokens must be a positive number" });
    }
    
    if (!remark) {
      return res.status(400).json({ message: "Remark is required" });
    }

    const user = await User.findOne({ mobile });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = new Token({
      userId : user._id,
      amount: tokens,
      remark,
      type: "add",
    });
    await token.save();

    user.walletBalance += Number(tokens);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeTokens = async (req, res) => {
  try {
    const { mobile } = req.params;
    const { tokens , remark } = req.body;

    if (!tokens || tokens <= 0) {
      return res
        .status(400)
        .json({ message: "Tokens must be a positive number" });
    }

    if (!remark) {
      return res.status(400).json({ message: "Remark is required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < tokens) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const token = new Token({
      userId : user._id,
      amount: tokens,
      remark,
      type: "remove",
    });
    await token.save();

    // Deduct tokens
    user.walletBalance -= Number(tokens);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
