import express from 'express';
import { getUserBids, createBid } from '../controllers/bidController.js';
import { isAuthenticated, isBidder,  } from '../middlewares/auth.js';
import {emitter} from "../utils/eventEmitter.js";

const router = express.Router();

router.get('/', isAuthenticated, getUserBids);

router.post('/', isAuthenticated, isBidder, createBid);

router.get("/updates", (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const update = (bid) => {
        res.write(`data: ${JSON.stringify(bid)}\n\n`);
    };
    emitter.on('bid', update);

    req.on('close', () => {
        emitter.off('bid', update);
    });
})

export default router;
