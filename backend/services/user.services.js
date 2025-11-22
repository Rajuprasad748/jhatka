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

export const findUserByMobile = async (req, res) => {
  const { mobile } = req.params ;
  const user = await User.findOne({ mobile });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
};

export const findAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    };

    return users;
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const GenerateToken = async (user) => {
  const token =  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  if(!token){
    return null;
  }
  return token;
};
