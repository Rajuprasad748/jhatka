import express from 'express';
import { findAllUsers, findUserByMobile } from '../services/user.services.js';
import { adminLogin , adminLogout , verifyAdmin} from '../controllers/adminController.js';
import { getAllGames, setAndProcessResult , updateGameTime ,  getGame , getResultsDatewise , showGamesToUsers , addGame , deleteGame} from '../controllers/gameController.js';
import { addTokens , removeTokens , getAllTokens } from '../controllers/walletController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.get('/all-users', findAllUsers);
router.get('/findUser/:mobile', findUserByMobile);




router.get('/allGames', getAllGames);
router.get('/games/:id', getGame);
router.post('/addGame', addGame);
router.put('/games/updateTime/:selectedGameId', updateGameTime);
router.put('/games/:selectedGame/showToUsers', showGamesToUsers);
router.post("/set-result/:gameId", setAndProcessResult);
router.get("/getResultDatewise", getResultsDatewise);
router.delete("/deleteGame/:gameId", deleteGame);

router.post("/login" , adminLogin);
router.post("/logout" , adminLogout);
router.get("/verify" , adminAuthMiddleware , verifyAdmin);


router.put('/addTokens/:mobile', addTokens);
router.put('/removeTokens/:mobile', removeTokens);
router.get('/tokenHistory', getAllTokens);



export default router;
