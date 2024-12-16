import express from 'express';
import {isAdmin, isAuthenticated} from "../middlewares/auth.js";
import {
    getAllLots,
    getLotById,
    getLotBids,
    deleteLot,
    createLot,
    updateLot,
} from '../controllers/lotController.js';

const router = express.Router();

router.get('/', getAllLots);
router.get('/:id', getLotById);
router.get('/:id/bids', getLotBids);

router.post('/', isAuthenticated, isAdmin, createLot);

router.patch('/:id', isAuthenticated, isAdmin, updateLot);

router.delete('/:id', isAuthenticated, isAdmin, deleteLot);

export default router;
