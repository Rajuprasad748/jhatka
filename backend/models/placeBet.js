import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game", // Reference to Game model
      required: true,
    },
    gameName: {
      type: String,
      required: true,
    },
    betType: {
      type: String,
      enum: [
        "singleDigit",
        "jodi",
        "singlePana",
        "doublePana",
        "triplePana",
        "halfSangam",
        "fullSangam",
      ],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    marketType: {
      type: String,
      enum: ["open", "close"],
      required: true,
    },
    digits: {
      type: Number,
      required: true,
      min: 0,
    },

    points: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "won", "lost"],
      default: "pending",
    },
    winningAmount: {
      type: Number,
      default: 0, // initially 0 until settled
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bet", betSchema);
