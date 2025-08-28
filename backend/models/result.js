import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  gameName: { type: String, required: true },
  type: { type: String, enum: ["open", "close"], required: true }, // 👈 open or close
  value: {
    type: [Number], // 👈 store digits as array [3,7,2]
    required: true,
  }, // actual result value
  scheduledTime: { type: Date, required: true }, // when to publish
  published: { type: Boolean, default: false }, // flag if result is visible
});

export default mongoose.model("Result", resultSchema);
