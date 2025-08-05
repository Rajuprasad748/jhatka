import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; 
import { findAllUsers } from './services/user.services.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies  


app.use(express.json());

// Routes (e.g., /api/users)
app.use('/api/users', userRoutes);
app.get('/api/admin/all-users', async (req, res) => {
    try {
        const users = await findAllUsers();
        console.log(users)
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
