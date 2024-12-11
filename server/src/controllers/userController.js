import { DBConnector } from "../database/connector.js";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { userSchema } from "../validators/userValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

const connector = new DBConnector();

export const getAllUsers = (req, res) => {
    try {
        const users = connector.readAll('users');

        if (users.length === 0) {
            res.status(200).json([]);
            return;
        }

        const formattedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        handleError(res, error);
    }
}

export const getUserBids = (req, res) => {
    try {
        const userId = req.user.id;
        const user = connector.read('users', userId);

        if (!user) {
            throw createErrorResponse(404, `User with id ${userId} not found`);
        }

        const userBids = connector.readAll('bids').filter(bid => bid.userId === user.id);
        res.status(200).json(userBids);
    } catch (error) {
        handleError(res, error);
    }
}

export const createUser = (req, res) => {
    try {
        const { email, password } = userSchema.parse(req.body);

        if (getUserByEmail(email)) {
            throw createErrorResponse(409, `User with email ${email} already exists`);
        }

        const newUser = new User(undefined, email, password);
        const savedUser = connector.create('users', newUser);
        const token = generateToken(savedUser);

        res.status(201).json({
            message: `New user with id ${savedUser.id} created successfully`,
            token
        });
    } catch (error) {
        handleError(res, error);
    }
}

export const deleteUser = (req, res) => {
    try {
        const userId = req.params.id;
        const user = connector.read('users', userId);

        if (!user) {
            throw createErrorResponse(404, `User with id ${userId} not found`);
        }

        connector.delete('users', userId);

        res.status(200).json({ message: `User with id ${userId} deleted successfully` });
    } catch (error) {
        handleError(res, error);
    }
}

export const getUserByEmail = (email) => {
    const users = connector.readAll('users');
    return users.find(user => user.email === email) || null;
}
