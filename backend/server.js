import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [`https://userfrontend-xnvv.onrender.com`, `https://royal10xadmin.onrender.com`, 
                        `http://localhost:5174`, `http://localhost:5173` , `https://royalmoney10x.online`];

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
    optionsSuccessStatus:200 ,
  })
);

app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies

app.use(express.json());
app.use(cookieParser());

app.get("/pingHealth", (req, res) => {
  res.status(200).send("OK");
});


// Routes (e.g., /api/users)
app.use("/users", userRoutes);
app.use("/admin" ,  adminRoutes);

const PORT = process.env.PORT || 5000;
connectDB().th.en(() => {
  app.listen(PORT,"0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
