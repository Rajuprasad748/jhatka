

// import mongoose from "mongoose";
// import Game from "../models/addGame.js";

// await mongoose.connect("mongodb://localhost:27017/jhatka");

// function getRandomDigits(len = 3) {
//   return Array.from({ length: len }, () => Math.floor(Math.random() * 10));
// }

// // const rawGames = [
// //   { name: "KALYAN", openingTime: "17:00", closingTime: "19:00" },
// //   { name: "KALYAN NIGHT", openingTime: "21:40", closingTime: "23:40" },
// //   { name: "MADHUR DAY", openingTime: "13:30", closingTime: "14:30" },
// //   { name: "MADHUR NIGHT", openingTime: "20:30", closingTime: "22:30" },
// //   { name: "MAIN BAZAR", openingTime: "21:40", closingTime: "00:05" },
// //   { name: "MILAN DAY", openingTime: "15:00", closingTime: "17:00" },
// //   { name: "MILAN NIGHT", openingTime: "21:00", closingTime: "23:00" },
// //   { name: "RAJDHANI DAY", openingTime: "15:00", closingTime: "17:00" },
// //   { name: "RAJDHANI NIGHT", openingTime: "21:30", closingTime: "23:40" },
// //   { name: "SRIDEVI", openingTime: "11:45", closingTime: "12:45" },
// //   { name: "SRIDEVI NIGHT", openingTime: "19:15", closingTime: "20:15" },
// //   { name: "TIME BAZAR", openingTime: "13:00", closingTime: "15:15" },
// //   { name: "TARA MUMBAI DAY", openingTime: "13:30", closingTime: "15:00" },
// //   { name: "TARA MUMBAI NIGHT", openingTime: "20:30", closingTime: "12:30" }
// // ];

// const rawGames = [
//   { name: "Big Bull", openingTime: "11:00", closingTime: "23:00" },
// ];

// function timeToDate(timeStr) {
//   const [hours, minutes] = timeStr.split(":").map(Number);
//   const now = new Date();
//   now.setHours(hours, minutes, 0, 0);
//   return now;
// }

// const gamesData ={
//   name: rawGames.name,
//   openingTime: timeToDate(rawGames.openingTime),
//   closingTime: timeToDate(rawGames.closingTime),
//   openDigits: getRandomDigits(),
//   closeDigits: getRandomDigits(),
//   toShow: false,
//   isPersonal: true
// }
 



// await Game.insert(gamesData);

// console.log("Games inserted successfully!");


import mongoose from "mongoose";
import Game from "../models/addGame.js";

await mongoose.connect("mongodb://localhost:27017/jhatka");

function getRandomDigits(len = 3) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10));
}

const rawGames = [
  { name: "Big Bull", openingTime: "11:00", closingTime: "23:00" },
  // You can add more games here
];

function timeToDate(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}

// Map rawGames into DB-ready objects
const gamesData = rawGames.map((g) => ({
  name: g.name,
  openingTime: timeToDate(g.openingTime),
  closingTime: timeToDate(g.closingTime),
  openDigits: getRandomDigits(),
  closeDigits: getRandomDigits(),
  showToUsers: false,   // ✅ match your frontend filtering key
  isPersonal: true,
}));

// Insert into MongoDB
await Game.insertMany(gamesData);

console.log("Games inserted successfully!");
mongoose.connection.close();
