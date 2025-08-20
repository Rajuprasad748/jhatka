import Bet from "../models/placeBet.js";

export const placeBet = async (req, res) => {
  try {
    const { betType, marketType, digits, points } = req.body;

    // Validation based on betType
    const lengthRules = {
      singleDigit: 1,
      jodi: 2,
      singlePana: 3,
      doublePana: 3,
      triplePana: 3,
      halfSangam: 4,
      fullSangam: 6,
    };

    if (!lengthRules[betType]) {
      return res.status(400).json({ message: "Invalid bet type" });
    }

    if (digits.length !== lengthRules[betType]) {
      return res
        .status(400)
        .json({ message: `Digits must be ${lengthRules[betType]} characters long` });
    }

    // Save bet with user reference
    const bet = new Bet({
      user: req.user.id, // Assuming user is set by auth middleware
      betType,
      marketType,
      digits,
      points,
    });

    await bet.save();
    res.status(201).json({ message: "Bet placed successfully", bet });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ message: "Server error" });
  }
};
