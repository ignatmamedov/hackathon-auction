import { DBConnector } from "../database/connector.js";
import { lotSchema } from "../validators/lotValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

const connector = new DBConnector();

/**
 * Checks if the provided categories (domain, license, language) exist.
 *
 * @param {object} item - The item object containing domainId, licenseId, languageId.
 * @throws {Error} If any of the provided category IDs do not exist.
 */
const isCategoryExist = (item) => {
    const domains = connector.readAll('domains').map(domain => domain.id);
    const licenses = connector.readAll('licenses').map(license => license.id);
    const languages = connector.readAll('languages').map(language => language.id);

    if (!domains.includes(item.domainId)) {
        throw createErrorResponse(400, `Domain with id ${item.domainId} does not exist`);
    }

    if (!licenses.includes(item.licenseId)) {
        throw createErrorResponse(400, `License with id ${item.licenseId} does not exist`);
    }

    if (!languages.includes(item.languageId)) {
        throw createErrorResponse(400, `Language with id ${item.languageId} does not exist`);
    }
};

/**
 * Creates a new lot.
 *
 * @param {Request} req - Request object, lot data in `req.body`.
 * @param {Response} res - Response object.
 * @returns {void} Responds with the created lot.
 */
export const createLot = (req, res) => {
    try {
        const lotData = lotSchema.parse(req.body);
        isCategoryExist(lotData.item);
        const newLot = connector.create('lots', lotData);
        res.status(201).json({
            message: 'Lot created successfully',
            lot: newLot
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Updates an existing lot.
 *
 * @param {Request} req - Request object, partial lot data in `req.body` and `id` in params.
 * @param {Response} res - Response object.
 * @returns {void} Responds with the updated lot.
 */
export const updateLot = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);

        if (!lot) throw createErrorResponse(404, `Lot with id ${id} not found`);

        const partialLotSchema = lotSchema.deepPartial();
        const updatedData = partialLotSchema.parse(req.body);

        const mergedData = {
            ...lot,
            ...updatedData,
            item: {
                ...lot.item,
                ...updatedData.item
            }
        };

        if (mergedData.item) {
            isCategoryExist(mergedData.item);
        }

        const updatedLot = connector.update('lots', id, mergedData);
        res.status(200).json({
            message: 'Lot updated successfully',
            lot: updatedLot
        });
    } catch (error) {
        console.log(res, error);
        handleError(res, error);
    }
};

/**
 * Retrieves all lots.
 *
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 * @returns {void} Responds with an array of lots.
 */
export const getAllLots = (req, res) => {
    try {
        const { query, domainId, licenseId, languageId, minPrice, maxPrice, sortBy, order } = req.query;

        let lots = connector.readAll('lots');

        if (query) {
            const lowerQuery = query.toLowerCase();
            lots = lots.filter(lot =>
                lot.item.name.toLowerCase().includes(lowerQuery) ||
                lot.item.description.toLowerCase().includes(lowerQuery)
            );
        }

        if (domainId) {
            const domainIds = Array.isArray(domainId) ? domainId : [domainId];
            lots = lots.filter(lot => domainIds.includes(String(lot.item.domainId)));
        }

        if (licenseId) {
            const licenseIds = Array.isArray(licenseId) ? licenseId : [licenseId];
            lots = lots.filter(lot => licenseIds.includes(String(lot.item.licenseId)));
        }

        if (languageId) {
            const languageIds = Array.isArray(languageId) ? languageId : [languageId];
            lots = lots.filter(lot => languageIds.includes(String(lot.item.languageId)));
        }
        if (minPrice) {
            lots = lots.filter(lot => lot.minBid >= parseFloat(minPrice));
        }

        if (maxPrice) {
            lots = lots.filter(lot => lot.minBid <= parseFloat(maxPrice));
        }

        if (sortBy) {
            lots = lots.sort((a, b) => {
                let valueA = a[sortBy];
                let valueB = b[sortBy];

                if (typeof valueA === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }

                if (valueA < valueB) return order === 'desc' ? 1 : -1;
                if (valueA > valueB) return order === 'desc' ? -1 : 1;
                return 0;
            });
        }

        res.status(200).json(lots);
    } catch (error) {
        handleError(res, error);
    }
};


/**
 * Retrieves a lot by its ID.
 *
 * @param {Request} req - Request object, `id` in params.
 * @param {Response} res - Response object.
 * @returns {void} Responds with the requested lot.
 */
export const getLotById = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);
        if (!lot) throw createErrorResponse(404, `Lot with id ${id} not found`);
        res.status(200).json(lot);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Retrieves all bids associated with a given lot ID.
 *
 * @param {Request} req - Request object, `id` in params.
 * @param {Response} res - Response object.
 * @returns {void} Responds with an array of bids.
 */
export const getLotBids = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);
        if (!lot) throw createErrorResponse(404, `Lot with id ${id} not found`);
        const bids = connector.readAll('bids').filter(bid => bid.lotId === id);
        res.status(200).json(bids);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Deletes a lot by its ID.
 *
 * @param {Request} req - Request object, `id` in params.
 * @param {Response} res - Response object.
 * @returns {void} Responds with a success message.
 */
export const deleteLot = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);
        if (!lot) throw createErrorResponse(404, `Lot with id ${id} not found`);
        connector.delete('lots', id);
        res.status(200).json({ message: `Lot with id ${id} deleted successfully` });
    } catch (error) {
        handleError(res, error);
    }
};
