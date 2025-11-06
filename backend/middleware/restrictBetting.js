// middleware/restrictBetting.js
import Game from "../models/addGame.js";

// Convert HH:MM of a Date into minutes since midnight
const toMinutes = (date) => date.getHours() * 60 + date.getMinutes();

// Check if a time falls inside a window, handling midnight wrap
const inWindow = (time, start, end) => {
  if (start <= end) {
    return time >= start && time <= end;
  } else {
    // overnight case
    return time >= start || time <= end;
  }
};

// Restriction: 15 min before/after open/close
const isRestricted = (openingTime, closingTime) => {
  const now = new Date();
  const nowMinutes = toMinutes(now);

  const openMinutes = toMinutes(openingTime);
  const closeMinutes = toMinutes(closingTime);

  const openStart = (openMinutes - 15 + 1440) % 1440;
  const openEnd = (openMinutes + 15) % 1440;
  const closeStart = (closeMinutes - 15 + 1440) % 1440;
  const closeEnd = (closeMinutes + 15) % 1440;

  return (
    inWindow(nowMinutes, openStart, openEnd) ||
    inWindow(nowMinutes, closeStart, closeEnd)
  );
};

// Check a single game for restrictions
const checkGameRestriction = (game) => {
  const nowMinutes = toMinutes(new Date());
  const openMinutes = toMinutes(new Date(game.openingTime));
  const closeMinutes = toMinutes(new Date(game.closingTime));

  // Betting closed after closeTime daily
  let isClosed;
  if (openMinutes < closeMinutes) {
    // normal case
    isClosed = nowMinutes >= closeMinutes;
  } else {
    // overnight case
    isClosed = !inWindow(nowMinutes, openMinutes, closeMinutes);
  }

  if (isClosed) {
    return "Betting closed for this game";
  }

  if (isRestricted(game.openingTime, game.closingTime)) {
    return "Betting disabled 15 min before/after results.";
  }

  return null; // no restriction
};

// Middleware
export const restrictBetting = async (req, res, next) => {
  try {
    let gamesToCheck = [];

    // If multiple bets, extract gameIds
    if (Array.isArray(req.body.bets) && req.body.bets.length > 0) {
      gamesToCheck = req.body.bets.map((b) => b.gameId);
    } else if (req.body.gameId) {
      gamesToCheck = [req.body.gameId];
    } else if (req.params.name) {
      const game = await Game.findOne({
        name: new RegExp(`^${req.params.name}$`, "i"),
      });
      if (!game) return res.status(404).json({ error: "Game not found" });
      gamesToCheck = [game._id];
    }

    const restrictedGames = [];

    for (const gameId of gamesToCheck) {
      const game = await Game.findById(gameId);
      if (!game) return res.status(404).json({ error: `Game not found: ${gameId}` });

      const restrictionMsg = checkGameRestriction(game);
      if (restrictionMsg) {
        restrictedGames.push({ gameId, message: restrictionMsg });
      }
    }

    if (restrictedGames.length > 0) {
      return res.status(403).json({
        error: "Some games cannot be bet on right now",
        details: restrictedGames,
      });
    }

    next();
  } catch (err) {
    console.error("Restriction check error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
