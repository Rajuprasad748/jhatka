import express from 'express';
import { registerUser , loginUser } from '../controllers/userController.js';
import { addMoneyToWallet } from '../controllers/walletController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/add-money', addMoneyToWallet);


export default router;
