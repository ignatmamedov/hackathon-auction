import { DBConnector } from "../database/connector.js";
import { Bid } from "../models/Bid.js";
import { bidSchema } from "../validators/bidValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";
import {emitter} from "../utils/eventEmitter.js";

const connector = new DBConnector();

/**
 * Retrieves a lot by its ID.
 *
 * @param {string} lotId - The ID of the lot to retrieve.
 * @returns {object} The lot object.
 * @throws {Error} If the lot is not found (404).
 */
const getLot = (lotId) => {
    const lot = connector.read('lots', lotId);
    if (!lot) {
        throw createErrorResponse(404, `Lot with id ${lotId} not found`);
    }
    return lot;
};

/**
 * Checks if the given lot is still active (end time not passed).
 *
 * @param {object} lot - The lot object to check.
 * @throws {Error} If the lot's auction has ended (400).
 */
const isLotActive = (lot) => {
    const now = new Date();
    if (new Date(lot.end) < now) {
        throw createErrorResponse(400, 'Auction for this lot has ended');
    }
};

/**
 * Checks if the user has already placed the highest bid on the given lot.
 *
 * @param {string} lotId - The ID of the lot.
 * @param {string|number} userId - The ID of the user.
 * @throws {Error} If the user's bid is the highest on this lot (400).
 */
const isUserAlreadyBid = (lotId, userId) => {
    const lotBids = connector.readAll('bids').filter(bid => bid.lotId === lotId);

    if (lotBids.length === 0) return;

    const highestBid = lotBids.reduce((max, bid) => bid.amount > max.amount ? bid : max, lotBids[0]);

    if (highestBid.userId === userId) {
        throw createErrorResponse(400, 'You have already placed a bid on this lot.');
    }
};

/**
 * Checks if the provided bid amount is higher than the current highest bid or the minimum bid.
 *
 * @param {number} amount - The proposed bid amount.
 * @param {string} lotId - The ID of the lot being bid on.
 * @param {number} minBid - The minimum starting bid for the lot.
 * @throws {Error} If the bid amount is not higher than the current highest bid (400).
 */
const isBidAmountValid = (amount, lotId, minBid) => {
    const lotBids = connector.readAll('bids').filter(bid => bid.lotId === lotId);
    const highestBid = lotBids.reduce((max, bid) => bid.amount > max ? bid.amount : max, minBid);
    if (amount <= highestBid) {
        throw createErrorResponse(400, `Your bid must be higher than the current highest bid (${highestBid})`);
    }
};

/**
 * Updates the minBid of a lot if the new bid amount is higher.
 */
const updateMinBidForLot = (lotId, newBidAmount) => {
    const lot = getLot(lotId);
    if (newBidAmount > lot.minBid) {
        const updatedLot = {
            ...lot,
            minBid: newBidAmount
        };
        connector.update('lots', lotId, updatedLot);
    }
};

/**
 * Creates a new bid for a given lot.
 */
export const createBid = (req, res) => {
    try {
        const { lotId, amount } = bidSchema.parse(req.body);
        const lot = getLot(lotId);

        isLotActive(lot);
        isUserAlreadyBid(lotId, req.user.id);
        isBidAmountValid(amount, lotId, lot.minBid);

        const newBid = new Bid(undefined, new Date().toISOString(), lotId, req.user.id, amount);
        const savedBid = connector.create('bids', newBid);

        updateMinBidForLot(lotId, amount);

        emitter.emit('bid', savedBid);

        res.status(201).json({
            message: "Bid created successfully.",
            bid: savedBid
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Retrieves all bids made by the currently authenticated user.
 *
 * @param {Request} req - Express request object containing `req.user.id`.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with status 200 and an array of bids belonging to the user.
 */
export const getUserBids = (req, res) => {
    try {
        const userId = req.user.id;
        const userBids = connector.readAll('bids').filter(bid => bid.userId === userId);
        res.status(200).json(userBids);
    } catch (error) {
        handleError(res, error);
    }
};
