import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
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
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bet", betSchema);
