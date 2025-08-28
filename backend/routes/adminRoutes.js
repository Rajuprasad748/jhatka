import express from 'express';
import { findAllUsers , findUserById } from '../services/user.services.js';
import { getAllGames, setResult, updateResult } from '../controllers/gameController.js';
import { addTokens , removeTokens } from '../controllers/walletController.js';

const router = express.Router();

router.get('/all-users', findAllUsers);
router.get('/games', getAllGames);
router.get('/findUser/:userId', findUserById);

router.put('/addTokens/:userId', addTokens);
router.put('/removeTokens/:userId', removeTokens);
// router.put("/games/:id", updateGameDigits);

router.post("/set-result/:gameId", setResult);

router.get("/results/:gameId", updateResult);


export default router;
