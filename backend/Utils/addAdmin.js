import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";

const seedAdmins = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/jhatka");

  const admins = [];

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