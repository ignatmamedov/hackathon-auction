import { verifyToken } from '../utils/jwt.js';
import { createErrorResponse } from '../utils/errorHandler.js';

/**
 * Middleware that checks if the request includes a valid authentication token.
 * If valid, sets `req.user`; otherwise, responds with a 401 error.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export const isAuthenticated = (req, res, next) => {
    try {
        req.user = verifyToken(req);
        next();
    } catch (error) {
        const errorResponse = createErrorResponse(401, 'Invalid or missing authentication token');
        res.status(errorResponse.error.code).json(errorResponse);
    }
};

/**
 * Middleware that checks if the authenticated user is an admin.
 * If not authenticated or not an admin, responds with an error.
 *
 * @param {Request} req - Express request object with `req.user`.
 * @param {Response} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        const errorResponse = createErrorResponse(401, 'User is not authenticated');
        return res.status(errorResponse.error.code).json(errorResponse);
    }

    if (!req.user.isAdmin) {
        const errorResponse = createErrorResponse(403, 'Admin access required');
        return res.status(errorResponse.error.code).json(errorResponse);
    }

    next();
};

/**
 * Middleware that checks if the authenticated user is a bidder (non-admin).
 * If not authenticated or is an admin, responds with an error.
 *
 * @param {Request} req - Express request object with `req.user`.
 * @param {Response} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
export const isBidder = (req, res, next) => {
    if (!req.user) {
        const errorResponse = createErrorResponse(401, 'User is not authenticated');
        return res.status(errorResponse.error.code).json(errorResponse);
    }

    if (req.user.isAdmin) {
        const errorResponse = createErrorResponse(403, 'Admins are not allowed to perform this action');
        return res.status(errorResponse.error.code).json(errorResponse);
    }

    next();
};
