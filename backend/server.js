import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import { initScheduler } from "./services/scheduler.js";


dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
  })
);

app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies

app.use(express.json());
app.use(cookieParser());

// Routes (e.g., /api/users)
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT,"0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    initScheduler();  // ✅ scheduler starts only when DB is ready
  });
});
