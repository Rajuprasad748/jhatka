import User from "../models/User.js";
import Token from "../models/token.model.js";
import ContactInfo from "../models/contactInfo.model.js";

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
    const { tokens, remark } = req.body;

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

    const token = new Token({
      userId: user._id,
      amount: tokens,
      remark,
      type: "add",
    });
    await token.save();

    user.walletBalance += Number(tokens);
    await user.save();

    await ContactInfo.findOneAndUpdate(
      {},
      { $inc: { amount: Number(tokens) } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Remove tokens from wallet
export const removeTokens = async (req, res) => {
  try {
    const { mobile } = req.params;
    const { tokens, remark } = req.body;

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
      userId: user._id,
      amount: tokens,
      remark,
      type: "remove",
    });
    await token.save();

    // Deduct tokens
    user.walletBalance -= Number(tokens);
    await user.save();

    await ContactInfo.findOneAndUpdate(
      {},
      { $inc: { amount: -Number(tokens) } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccountInfo = async (req, res) => {
 try {
    const result = await Token.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { 
              format: "%d-%m-%Y", 
              date: "$time",
              timezone: "Asia/Kolkata"
            }
          },
          totalAdded: {
            $sum: {
              $cond: [{ $eq: ["$type", "add"] }, "$amount", 0]
            }
          },
          totalWithdrawn: {
            $sum: {
              $cond: [{ $eq: ["$type", "remove"] }, "$amount", 0]
            }
          },
          // Store a raw date value for sorting
          sortDate: { $min: "$time" }
        }
      },
      {
        $sort: { sortDate: -1 } // ✅ Sort by actual date (latest first)
      },
      {
        $project: {
          _id: 1,
          totalAdded: 1,
          totalWithdrawn: 1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
