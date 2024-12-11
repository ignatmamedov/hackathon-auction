import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { getUserByEmail } from "./userController.js";
import { userSchema } from "../validators/userValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

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
