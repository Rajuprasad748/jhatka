// scheduler.js
import schedule from "node-schedule";
import Result from "../models/result.js";
import Game from "../models/addGame.js";
import { processBets } from "../controllers/gameController.js"; // ✅ use private function

// Parse "hh:mm AM/PM" → { hour, minute }
function parseTime(timeStr) {
  let [time, meridian] = timeStr.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (meridian === "PM" && hour !== 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;

  return { hour, minute };
}

// Schedules jobs for each game
function scheduleGameJobs(games) {
  games.forEach((game) => {
    const { hour: openHour, minute: openMinute } = parseTime(game.openingTime);
    const { hour: closeHour, minute: closeMinute } = parseTime(game.closingTime);

    // 👉 OPEN JOB
    schedule.scheduleJob({ hour: openHour, minute: openMinute }, async function () {
      console.log(`🔓 Game "${game.name}" OPEN JOB running at ${new Date()}`);
      try {
        const result = await Result.findOne({ gameId: game._id, type: "open", published: false });

        console.log('result' , result)

        if (result) {
          result.published = true;
          await result.save();

          game.openDigits = result.value;
          await game.save();

          console.log(`✅ Published OPEN result for "${game.name}" → ${result.value.join("")}`);

          // ✅ Immediately process bets
          await processBets(game._id, "open");
          console.log(" done")
        } else {
          console.log(`⚠️ No OPEN result found for "${game.name}"`);
        }
      } catch (err) {
        console.error(`❌ Error in OPEN job for "${game.name}":`, err.message);
      }
    });

    // 👉 CLOSE JOB
    schedule.scheduleJob({ hour: closeHour, minute: closeMinute }, async function () {
      console.log(`🔒 Game "${game.name}" CLOSE JOB running at ${new Date()}`);
      try {
        const result = await Result.findOne({ gameId: game._id, type: "close", published: false });
        console.log("result close object", result);
        if (result) {
          result.published = true;
          await result.save();

          game.closeDigits = result.value;
          await game.save();

          console.log("object", game)

          console.log(`✅ Published CLOSE result for "${game.name}" → ${result.value.join("")}`);

          // ✅ Immediately process bets
          console.log("before processBets");
          await processBets(game._id, "close");
        } else {
          console.log(`⚠️ No CLOSE result found for "${game.name}"`);
        }
      } catch (err) {
        console.error(`❌ Error in CLOSE job for "${game.name}":`, err.message);
      }
    });

    console.log(`📌 Scheduled jobs for game: ${game.name}`);
  });
}

// Initialize all schedules on server start
export async function initScheduler() {
  try {
    const games = await Game.find();
    if (!games.length) {
      console.log("⚠️ No games found in DB to schedule");
      return;
    }
    console.log("📅 Initializing daily game schedulers...");
    scheduleGameJobs(games);
  } catch (err) {
    console.error("❌ Error initializing scheduler:", err.message);
  }
}
