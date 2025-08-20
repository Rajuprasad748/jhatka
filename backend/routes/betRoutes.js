import express from "express";
import { placeBet } from "../controllers/betController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/place-bet" , placeBet);
router.post("/place-bet" , authMiddleware, placeBet);

export default router;
