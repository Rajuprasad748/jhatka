import express from 'express';
import { findAllUsers } from '../services/user.services.js';
import { getAllGames, updateGameDigits } from '../controllers/gameController.js';

const router = express.Router();

router.post('/all-uesrs', findAllUsers);
router.get('/games', getAllGames);
router.put("/games/:id", updateGameDigits);


export default router;
