import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error("User not found");
  }
};

export const findAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

export const GenerateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
