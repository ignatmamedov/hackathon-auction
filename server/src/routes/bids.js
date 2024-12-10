import express from 'express';
import { getUserBids, createBid } from '../controllers/bidController.js';
import { isAuthenticated, isBidder,  } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, getUserBids);

router.post('/', isAuthenticated, isBidder, createBid);

export default router;
