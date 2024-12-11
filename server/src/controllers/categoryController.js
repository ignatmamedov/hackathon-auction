import { DBConnector } from "../database/connector.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

const connector = new DBConnector();
const categories = ['domains', 'languages', 'licenses'];

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
