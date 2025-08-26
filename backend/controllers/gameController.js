import Game from "../models/addGame.js";
import Result from "../models/result.js";

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ error: "Server error while fetching games" });
  }
};


export const setResult = async (req, res) => {
  try {
    const { gameId, type, value } = req.body;

    // Find game to get its open/close time
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    let scheduledTime;
    if (type === "open") scheduledTime = game.openTime;
    else if (type === "close") scheduledTime = game.closeTime;
    else return res.status(400).json({ message: "Invalid type" });

    const result = new Result({
      gameId,
      type,
      value,
      scheduledTime,
      published: false, // will be true only after scheduledTime
    });

    await result.save();

    res.json({ message: "Result scheduled successfully", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateResult = async (req, res) => {
  try {
    const { gameId } = req.params;

    // fetch all results (open + close) for a game
    const results = await Result.find({ gameId });

    // filter based on time
    const visibleResults = results.filter(r => {
      return new Date() >= new Date(r.scheduledTime);
    });

    res.json({ results: visibleResults });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}