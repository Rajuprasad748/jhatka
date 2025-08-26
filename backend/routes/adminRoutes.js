import express from 'express';
import { findAllUsers } from '../services/user.services.js';
import { getAllGames, setResult, updateResult } from '../controllers/gameController.js';

const router = express.Router();

router.post('/all-uesrs', findAllUsers);
router.get('/games', getAllGames);
// router.put("/games/:id", updateGameDigits);

router.post("/set-result", setResult);

router.get("/results/:gameId", updateResult);


export default router;
