import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Extract token from cookies
    
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decode" , decoded)
    

    // ✅ Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    console.log("requser" , req.user)

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
