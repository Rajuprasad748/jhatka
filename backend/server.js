import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';
import betRoutes from './routes/betRoutes.js';
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

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
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bet', betRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

