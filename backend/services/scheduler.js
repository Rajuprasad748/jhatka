// scheduler.js
import schedule from "node-schedule";
import Result from "../models/result.js";
import Game from "../models/addGame.js";

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



    // 👉 OPEN JOB (runs every day at openingTime)
    schedule.scheduleJob(
      { hour: openHour, minute: openMinute },
      async function () {
        console.log(`🔓 Game "${game.name}" OPEN JOB running at ${new Date()}`);

        try {
          const result = await Result.findOne({
            gameId: game._id,
            type: "open",
            published: false,
          });

          if (result) {
            result.published = true;
            await result.save();

            game.openDigits = result.value; // e.g. [3,7,2]
            await game.save();

            console.log(
              `✅ Published OPEN result for "${game.name}" → ${result.value.join(
                ""
              )}`
            );
          } else {
            console.log(`⚠️ No OPEN result found for "${game.name}"`);
          }
        } catch (err) {
          console.error(
            `❌ Error in OPEN job for "${game.name}":`,
            err.message
          );
        }
      }
    );

    // 👉 CLOSE JOB (runs every day at closingTime)
    schedule.scheduleJob(
      { hour: closeHour, minute: closeMinute },
      async function () {
        console.log(`🔒 Game "${game.name}" CLOSE JOB running at ${new Date()}`);

        try {
          const result = await Result.findOne({
            gameId: game._id,
            type: "close",
            published: false,
          });

          if (result) {
            result.published = true;
            await result.save();

            game.closeDigits = result.value; // e.g. [4,9,1]
            await game.save();

            console.log(
              `✅ Published CLOSE result for "${game.name}" → ${result.value.join(
                ""
              )}`
            );
          } else {
            console.log(`⚠️ No CLOSE result found for "${game.name}"`);
          }
        } catch (err) {
          console.error(
            `❌ Error in CLOSE job for "${game.name}":`,
            err.message
          );
        }
      }
    );

    console.log(`📌 Scheduled jobs for game: ${game.name}`);
  });
}

// Initialize all schedules on server start
export async function initScheduler() {
  try {
    const games = await Game.find(); // fetch from DB
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
