// middlewares/checkResultVisibility.js
import Game from "../models/addGame.js";

export const checkResultVisibility = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const now = new Date();
    if (!game.visibleAt || now < game.visibleAt) {
      return res.status(403).json({ message: "Result not available yet" });
    }

    req.game = game; // pass game to next controller
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
