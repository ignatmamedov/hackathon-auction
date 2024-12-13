import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { getUserByEmail } from "./userController.js";
import { userSchema } from "../validators/userValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

/**
 * Logs in a user and returns a JWT token on success.
 *
 * @param {Request} req - Express request, expects `email` and `password` in `req.body`.
 * @param {Response} res - Express response.
 * @returns {void} Responds with a JSON object: { message: "Login successful", token: "<JWT token>" } on success,
 * or an error response on failure.
 */
export const loginUser = (req, res) => {
    try {
        const { email, password } = userSchema.parse(req.body);

        const user = getUserByEmail(email);
        if (!user) {
            throw createErrorResponse(404, `User with email ${email} not found`);
        }

        if (!User.checkUserPassword(password, user.password)) {
            throw createErrorResponse(401, 'Invalid password');
        }

        const token = generateToken(user);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        handleError(res, error);
    }
};