import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  openingTime: { type: Date, required: true },
  closingTime: { type: Date, required: true },
  openDigits: { type: [Number], required: true },
  closeDigits: { type: [Number], required: true },
  showToUsers: { type: Boolean, default: true },
  isPersonal: { type: Boolean, default: false },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
