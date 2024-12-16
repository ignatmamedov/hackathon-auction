import { DBConnector } from "../database/connector.js";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { userSchema } from "../validators/userValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

const connector = new DBConnector();

/**
 * Creates a new user and returns a JWT token.
 *
 * @param {Request} req - The request object, containing `email` and `password` in `req.body`.
 * @param {Response} res - The response object.
 * @returns {void} Responds with status 201 and a JSON object containing a message and a token.
 * @throws {Error} If the user already exists or if validation fails.
 */
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
};

/**
 * Retrieves a user by their email address.
 *
 * @param {string} email - The email to search for.
 * @returns {object|null} The user object if found, otherwise null.
 */
export const getUserByEmail = (email) => {
    const users = connector.readAll('users');
    return users.find(user => user.email === email) || null;
};