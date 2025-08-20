import express from 'express';
import { registerUser , loginUser , logoutUser } from '../controllers/userController.js';
import { addMoneyToWallet } from '../controllers/walletController.js';
import { getAllGames } from '../controllers/gameController.js';

const router = express.Router();

router.get("/games", getAllGames);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/add-money', addMoneyToWallet);


export default router;
