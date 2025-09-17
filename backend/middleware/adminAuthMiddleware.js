import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    // ✅ Extract token from cookies
    
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decode adminAuthMiddleware" , decoded)
    

    // ✅ Attach admin to request
    req.admin = await Admin.findById(decoded.id).select("-password");

    console.log("req admin" , req.admin)

    if (!req.admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || "Invalid token" });
  }
};
