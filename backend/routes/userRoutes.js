import express from 'express';
import { registerUser , loginUser , logoutUser , verifyUser , getTokenHistory } from '../controllers/userController.js';
import { getAllGames , getResultsDatewise } from '../controllers/gameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {restrictBetting} from '../middleware/restrictBetting.js';
import { placeBets , getBetHistory} from '../controllers/betController.js';
import { getContactInfo } from '../controllers/contactController.js';
import { getWalletHistory } from '../controllers/walletController.js';

const router = express.Router();

//Those routes are without middleware no authentication
router.get("/games", getAllGames);
router.get("/contactInfo", getContactInfo);
router.get("/getResultDatewise", getResultsDatewise);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);




//Those routes are protected and need authentication

router.use(authMiddleware);

router.get("/betHistory", getBetHistory);
router.get('/verify' , verifyUser);
router.get("/tokenHistory", getTokenHistory);
router.get("/walletHistory", getWalletHistory);


router.post("/place-bets", restrictBetting, placeBets);

export default router;
