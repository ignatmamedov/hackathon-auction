import { DBConnector } from "../database/connector.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

const connector = new DBConnector();
const categories = ['domains', 'languages', 'licenses'];

/**
 * Retrieves all categories (domains, languages, licenses) from the database.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with a JSON object containing category arrays.
 */
export const getAllCategories = (req, res) => {
    try {
        const data = {};
        for (const category of categories) {
            data[category] = connector.readAll(category);
        }
        res.status(200).json(data);
    } catch (error) {
        handleError(res, createErrorResponse(500, 'Internal server error'));
    }
};
