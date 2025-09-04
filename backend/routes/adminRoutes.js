import express from 'express';
import { findAllUsers , findUserById } from '../services/user.services.js';
import { getAllGames, setResult , updateGameTime ,  getGame} from '../controllers/gameController.js';
import { addTokens , removeTokens , getAllTokens } from '../controllers/walletController.js';

const router = express.Router();

router.get('/all-users', findAllUsers);
router.get('/findUser/:userId', findUserById);


router.get('/allGames', getAllGames);
router.get('/games/:id', getGame);
router.put('/games/updateTime/:selectedGameId', updateGameTime);
router.post("/set-result/:gameId", setResult);



router.put('/addTokens/:userId', addTokens);
router.put('/removeTokens/:userId', removeTokens);
router.get('/tokenHistory', getAllTokens);



export default router;
