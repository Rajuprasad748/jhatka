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

// Middleware
export const restrictBetting = async (req, res, next) => {
  try {
    const { gameId } = req.body || req.params;

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

    // Extract times as minutes
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
      return res.status(400).json({ error: "Betting closed for this game" });
    }

    // Restriction window
    if (isRestricted(game.openingTime, game.closingTime)) {
      return res.status(403).json({
        error: "Betting disabled 15 min before/after results.",
      });
    }

    req.game = game;
    next();
  } catch (err) {
    console.error("Restriction check error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
