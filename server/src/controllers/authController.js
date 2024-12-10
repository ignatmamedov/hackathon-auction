import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { getUserByEmail } from "./userController.js";
import {userSchema} from "../validators/userValidator.js";

export const loginUser = (req, res) => {
    try {
        const { email, password } = userSchema.parse(req.body);

        const user = getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: `User with email ${email} not found` });
        }

        if (!User.checkUserPassword(password, user.password)) {
            return res.status(401).json({ error: `Invalid password` });
        }

        const token = generateToken(user);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors });
        }
        res.status(400).json({ error: error.message });
    }
}
