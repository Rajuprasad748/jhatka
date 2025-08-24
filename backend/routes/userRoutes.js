import express from 'express';
import { registerUser , loginUser , logoutUser , verifyUser } from '../controllers/userController.js';
import { addMoneyToWallet } from '../controllers/walletController.js';
import { getAllGames } from '../controllers/gameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/verify', authMiddleware , verifyUser);
router.get("/games", getAllGames);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/add-money', addMoneyToWallet);


export default router;
