import {verifyToken} from '../utils/jwt.js';

export const isAuthenticated = (req, res, next) => {
    try {
        req.user = verifyToken(req);
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
};

export const isBidder = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    if (req.user.isAdmin) {
        return res.status(403).json({ error: 'Admins are not allowed to perform this action' });
    }

    next();
};
