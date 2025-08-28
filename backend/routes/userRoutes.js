import express from 'express';
import { registerUser , loginUser , logoutUser , verifyUser } from '../controllers/userController.js';
import { getAllGames } from '../controllers/gameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {restrictBetting} from '../middleware/restrictBetting.js';
import { placeBet } from '../controllers/betController.js';

const router = express.Router();

router.get('/verify', authMiddleware , verifyUser);
router.get("/games", getAllGames);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post("/place-bet", authMiddleware, restrictBetting, placeBet);


export default router;
