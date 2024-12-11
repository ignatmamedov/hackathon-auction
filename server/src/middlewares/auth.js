import { verifyToken } from '../utils/jwt.js';
import { createErrorResponse } from '../utils/errorHandler.js';

export const isAuthenticated = (req, res, next) => {
    try {
        req.user = verifyToken(req);
        next();
    } catch (error) {
        const errorResponse = createErrorResponse(401, 'Invalid or missing authentication token');
        res.status(errorResponse.error.code).json(errorResponse);
    }
};

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
