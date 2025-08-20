import mongoose from "mongoose";
import Game from "./models/addGame.js";

// All game objects
const games = [
  { name: "KALYAN", openingTime: "11:00 AM", closingTime: "12:00 PM", openDigits: [3, 7, 2], closeDigits: [1, 4, 6] },
  { name: "MAIN MUMBAI", openingTime: "12:30 PM", closingTime: "01:30 PM", openDigits: [4, 0, 6], closeDigits: [9, 5, 1] },
  { name: "RAJDHANI DAY", openingTime: "02:00 PM", closingTime: "03:00 PM", openDigits: [8, 3, 6], closeDigits: [4, 2, 9] },
  { name: "MILAN DAY", openingTime: "03:30 PM", closingTime: "04:30 PM", openDigits: [7, 1, 4], closeDigits: [6, 5, 2] },
  { name: "SRIDEVI", openingTime: "05:00 PM", closingTime: "06:00 PM", openDigits: [9, 2, 5], closeDigits: [3, 0, 7] },
  { name: "TIME BAZAR", openingTime: "06:30 PM", closingTime: "07:30 PM", openDigits: [1, 5, 8], closeDigits: [4, 7, 0] },
  { name: "MADHUR DAY", openingTime: "08:00 PM", closingTime: "09:00 PM", openDigits: [6, 9, 2], closeDigits: [1, 3, 8] },
  { name: "KALYAN NIGHT", openingTime: "09:30 PM", closingTime: "10:30 PM", openDigits: [0, 2, 7], closeDigits: [9, 1, 3] },
  { name: "RAJDHANI NIGHT", openingTime: "11:00 PM", closingTime: "12:00 AM", openDigits: [8, 6, 4], closeDigits: [5, 0, 7] },
  { name: "MILAN NIGHT", openingTime: "12:30 AM", closingTime: "01:30 AM", openDigits: [3, 8, 5], closeDigits: [2, 4, 1] },
  { name: "MAIN BAZAR", openingTime: "02:00 AM", closingTime: "03:00 AM", openDigits: [9, 7, 1], closeDigits: [8, 3, 2] },
  { name: "SRIDEVI NIGHT", openingTime: "03:30 AM", closingTime: "04:30 AM", openDigits: [5, 1, 6], closeDigits: [0, 9, 4] }
];


// Bulk insert function
async function insertGames() {
  try {
    await Game.insertMany(games);
    console.log("✅ All games inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting games:", error);
  }
}

export default insertGames;