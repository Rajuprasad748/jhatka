// middleware/restrictBetting.js
import Game from "../models/addGame.js";

const isRestricted = (openingTime, closingTime) => {
  const now = new Date();

  const open = new Date(openingTime);
  const close = new Date(closingTime);

  const openRestrictedStart = new Date(open.getTime() - 15 * 60 * 1000);
  const openRestrictedEnd = new Date(open.getTime() + 15 * 60 * 1000);

  const closeRestrictedStart = new Date(close.getTime() - 15 * 60 * 1000);
  const closeRestrictedEnd = new Date(close.getTime() + 15 * 60 * 1000);

  return (
    (now >= openRestrictedStart && now <= openRestrictedEnd) ||
    (now >= closeRestrictedStart && now <= closeRestrictedEnd)
  );
};

// ✅ Middleware function
export const restrictBetting = async (req, res, next) => {
  try {
    const { gameId } = req.body || req.params;

    // find game either by ID (for placing bets) or by name (for game details)
    let game;
    if (gameId) {
      game = await Game.findById(gameId);
    } else if (req.params.name) {
      game = await Game.findOne({
        name: new RegExp(`^${req.params.name}$`, "i"),
      });
    }

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (isRestricted(game.openingTime, game.closingTime)) {
      return res
        .status(403)
        .json({ error: "Betting is disabled 15 min before and after results." });
    }

    // attach game to request for downstream handlers
    req.game = game;
    next();
  } catch (err) {
    console.error("Restriction check error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
