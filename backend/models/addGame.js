import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  openDigits: { type: [Number], required: true },
  closeDigits: { type: [Number], required: true },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
