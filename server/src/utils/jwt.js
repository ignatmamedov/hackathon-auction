import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates a JWT token for the given user.
 *
 * @param {object} user - The user object containing at least `id`, `email`, and `isAdmin`.
 * @returns {string} A JWT token that expires in 1 hour.
 */
export const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifies the JWT token found in the request's Authorization header.
 */
export const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Token not found');
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
