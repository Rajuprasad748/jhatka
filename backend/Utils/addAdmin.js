import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";

const seedAdmins = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/jhatka");

  const admins = [
    { username: "admin1", mobile: "9990000001", password: "admin123" },
    { username: "admin2", mobile: "9990000002", password: "admin123" },
    { username: "admin3", mobile: "9990000003", password: "admin123" },
    { username: "admin4", mobile: "9990000004", password: "admin123" },
    { username: "admin5", mobile: "9990000005", password: "admin123" },
    { username: "admin6", mobile: "9990000006", password: "admin123" },
  ];

  // hash passwords
  for (let admin of admins) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }

  await Admin.deleteMany({});
  await Admin.insertMany(admins);

  console.log("✅ Dummy admins inserted!");
  process.exit();
};

seedAdmins();
// To run this script, use the command: node backend/Utils/addAdmin.js