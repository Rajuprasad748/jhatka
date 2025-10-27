
import { findAllUsers } from "../services/user.services.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export const allUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const adminLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const admin = await Admin.findOne({ mobile });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { 
      httpOnly: true ,
      maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
      secure: true, 
      sameSite: "None"
    });

    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, mobile: admin.mobile },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const verifyAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCollections = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const names = collections.map((col) => col.name);
    res.json(names);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch collections" });
  }
};

// ✅ Execute MongoDB query securely
export const runQuery = async (req, res) => {
  try {
    const { collection, query = {}, lookup, project, aggregate } = req.body;

    if (!collection) {
      return res.status(400).json({ message: "Collection name required" });
    }

    const db = mongoose.connection.db;
    const col = db.collection(collection);

    let data;

    // If user sends custom aggregation pipeline, use it directly
    if (aggregate && Array.isArray(aggregate)) {
      data = await col.aggregate(aggregate).toArray();
    }
    // Otherwise dynamically build one
    else if (lookup || project) {
      const pipeline = [];

      if (query && Object.keys(query).length) pipeline.push({ $match: query });
      if (lookup) pipeline.push({ $lookup: lookup });
      if (project) pipeline.push({ $project: project });

      data = await col.aggregate(pipeline).toArray();
    } 
    // Else: basic find query
    else {
      data = await col.find(query).limit(200).toArray();
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};