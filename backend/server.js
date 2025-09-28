import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [`https://userfrontend-xnvv.onrender.com`, `https://jhatkabackend.onrender.com`];

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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"],    // add needed headers
  })
);

app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies

app.use(express.json());
app.use(cookieParser());

// Routes (e.g., /api/users)
app.use("/users", userRoutes);
app.use("/admin" ,  adminRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT,"0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
