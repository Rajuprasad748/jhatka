import Game from "../models/addGame.js";

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ error: "Server error while fetching games" });
  }
};


export const updateGameDigits = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, digits } = req.body; // type = "open" or "close"

    console.log("Updating game:", id, "Type:", type, "Digits:", digits);

    if (!Array.isArray(digits) || digits.length === 0) {
      return res.status(400).json({ error: "Digits array is required" });
    }

    const updateField =
      type === "open" ? { openDigits: digits } : { closeDigits: digits };

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: updateField },
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(updatedGame);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update game" });
  }
}