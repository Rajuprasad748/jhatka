import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Token from "../models/token.model.js";
import { findUserByMobile } from "../services/user.services.js";
import { GenerateToken } from "../services/user.services.js";

export const registerUser = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // Check required fields
    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await findUserByMobile(mobile);
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this mobile number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = GenerateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Find user by mobile
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }
    // Verify password (assuming you hashed it with bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    // Generate JWT
    const token = GenerateToken(user);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
};

export const verifyUser = (req, res) => {
  console.log("object of userController" , req.user);
  res.json({ isLoggedIn: true, user: req.user });
};


export const getTokenHistory = async (req, res) => {

  try {
    console.log("object" , req.user)
    const userId = req.user._id;
    const history = await Token.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error fetching token history:", error);
    res.status(500).json({ message: "Server error" });
  }
};
