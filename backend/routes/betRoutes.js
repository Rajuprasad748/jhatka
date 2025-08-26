import express from "express";
import { placeBet } from "../controllers/betController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { restrictBetting } from "../middleware/restrictBetting.js";

const router = express.Router();

// router.post("/place-bet" , placeBet);
router.post("/place-bet", authMiddleware, restrictBetting, placeBet);


export default router;
