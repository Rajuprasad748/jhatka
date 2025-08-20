import bcrypt from "bcryptjs";
import User from "../models/User.js";
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
      return res.status(400).json({ message: "User already exists with this mobile number" });
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
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
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
    console.log("rrr");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }
    

    // Generate JWT
    const token = GenerateToken(user);
    console.log("Generated token:", token);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("stored cookie")

    res.status(200).json({
      message: "Login successful",
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

export const logoutUser = async (req, res) => {
  try {
    // Clear cookie
     res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
