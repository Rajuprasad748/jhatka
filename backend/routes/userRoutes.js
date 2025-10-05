import express from 'express';
import { registerUser , loginUser , logoutUser , verifyUser , getTokenHistory } from '../controllers/userController.js';
import { getAllGames , getResultsDatewise } from '../controllers/gameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {restrictBetting} from '../middleware/restrictBetting.js';
import { placeBet , getBetHistory} from '../controllers/betController.js';
import { getContactInfo } from '../controllers/contactController.js';

const router = express.Router();


router.get('/verify', authMiddleware , verifyUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);


router.get("/games", getAllGames);
router.get("/tokenHistory", authMiddleware, getTokenHistory);

router.get("/contactInfo", getContactInfo);

router.post("/place-bet", authMiddleware, restrictBetting, placeBet);
router.get("/betHistory", authMiddleware, getBetHistory);
router.get("/getResultDatewise", authMiddleware, getResultsDatewise);

export default router;
