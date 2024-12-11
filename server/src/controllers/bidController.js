import { DBConnector } from "../database/connector.js";
import { Bid } from "../models/Bid.js";
import { bidSchema } from "../validators/bidValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

const connector = new DBConnector();

const getLot = (lotId) => {
    const lot = connector.read('lots', lotId);
    if (!lot) {
        throw createErrorResponse(404, `Lot with id ${lotId} not found`);
    }
    return lot;
};

const isLotActive = (lot) => {
    const now = new Date();
    if (new Date(lot.end) < now) {
        throw createErrorResponse(400, 'Auction for this lot has ended');
    }
};

const isUserAlreadyBid = (lotId, userId) => {
    const existingBid = connector.readAll('bids').find(bid => bid.lotId === lotId && bid.userId === userId);
    if (existingBid) {
        throw createErrorResponse(400, 'You have already placed a bid on this lot.');
    }
};

const isBidAmountValid = (amount, lotId, minBid) => {
    const lotBids = connector.readAll('bids').filter(bid => bid.lotId === lotId);
    const highestBid = lotBids.reduce((max, bid) => bid.amount > max ? bid.amount : max, minBid);
    if (amount <= highestBid) {
        throw createErrorResponse(400, `Your bid must be higher than the current highest bid (${highestBid})`);
    }
};

export const createBid = (req, res) => {
    try {
        const { lotId, amount } = bidSchema.parse(req.body);
        const lot = getLot(lotId);

        isLotActive(lot);
        isUserAlreadyBid(lotId, req.user.id);
        isBidAmountValid(amount, lotId, lot.minBid);

        const newBid = new Bid(undefined, new Date().toISOString(), lotId, req.user.id, amount);
        const savedBid = connector.create('bids', newBid);

        res.status(201).json({
            message: "Bid created successfully.",
            bid: savedBid
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getUserBids = (req, res) => {
    try {
        const userId = req.user.id;
        const userBids = connector.readAll('bids').filter(bid => bid.userId === userId);
        res.status(200).json(userBids);
    } catch (error) {
        handleError(res, error);
    }
};
