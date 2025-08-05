import express from 'express';
import { findAllUsers } from '../services/user.services.js';

const router = express.Router();

router.post('/all-uesrs', findAllUsers);


export default router;
