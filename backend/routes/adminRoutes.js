import express from 'express';
import { findAllUsers, findUserByMobile } from '../services/user.services.js';
import { adminLogin , adminLogout , getCollections, runQuery, verifyAdmin} from '../controllers/adminController.js';
import { getContactInfo, updateContactField } from '../controllers/contactController.js';
import { getAllGames, setAndProcessResult , updateGameTime ,  getGame , getResultsDatewise , showGamesToUsers , addGame , deleteGame} from '../controllers/gameController.js';
import { addTokens , removeTokens , getAllTokens , getAccountInfo } from '../controllers/walletController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';
import {  getAllBets, getUserBetHistory, recallResults } from '../controllers/betController.js';

const router = express.Router();
router.post("/login" , adminLogin);
router.post("/logout" , adminLogout);


router.use(adminAuthMiddleware);


//All the routes below this line are protected and require admin role authentication
router.get('/all-users', findAllUsers);
router.get('/findUser/:mobile', findUserByMobile);
router.get('/allBets', getAllBets);
router.get('/contactInfo', getContactInfo);
router.get('/account' , getAccountInfo);
router.get('/collections' , getCollections);
router.get('/userBetHistory' , getUserBetHistory)
router.get('/allGames', getAllGames);
router.get('/games/:id', getGame);
router.get('/tokenHistory', getAllTokens);
router.get("/verify" , verifyAdmin);
router.get("/getResultDatewise", getResultsDatewise);






router.post('/query' , runQuery);
router.post('/recallResult' , recallResults);
router.post("/set-result/:gameId", setAndProcessResult);
router.post('/addGame', addGame);




router.put('/games/updateTime/:selectedGameId', updateGameTime);
router.put('/games/:selectedGame/showToUsers', showGamesToUsers);
router.put('/addTokens/:mobile', addTokens);
router.put('/removeTokens/:mobile', removeTokens);
router.put('/updateContactInfo', updateContactField);



router.delete("/deleteGame/:gameId", deleteGame);




export default router;
