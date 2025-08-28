import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const findUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    };
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    throw new Error("User not found");
  }
};

export const findUserByMobile = async (mobile) => {
  const user = await User.findOne({ mobile });
  return user;
};

export const findAllUsers = async (req, res) => {
  try {
    console.log("FIndallUsers");
    const users = await User.find({});
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const GenerateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
