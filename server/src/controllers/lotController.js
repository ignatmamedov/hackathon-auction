import { DBConnector } from "../database/connector.js";
import {lotSchema} from "../validators/lotValidator.js";
import {handleError} from "../utils/errorHandler.js";

const connector = new DBConnector();

const filterByQuery = (lots, query) => {
    if (!query) return lots;
    return lots.filter(lot =>
        lot.item.name.toLowerCase().includes(query.toLowerCase()) ||
        lot.item.description.toLowerCase().includes(query.toLowerCase())
    );
};

const filterByCategories = (lots, categoryName, ids) => {
    if (!ids) return lots;
    const categoryIds = ids.split(',').map(id => parseInt(id));
    return lots.filter(lot => categoryIds.includes(lot.item[categoryName]));
};

const filterByPriceRange = (lots, minPrice, maxPrice) => {
    if (minPrice) {
        lots = lots.filter(lot => lot.minBid >= parseFloat(minPrice));
    }
    if (maxPrice) {
        lots = lots.filter(lot => lot.minBid <= parseFloat(maxPrice));
    }
    return lots;
};

const sortLots = (lots, sortBy, order) => {
    if (!sortBy) return lots;
    return lots.sort((a, b) => {
        const fieldA = a[sortBy];
        const fieldB = b[sortBy];

        if (fieldA < fieldB) return order === 'desc' ? 1 : -1;
        if (fieldA > fieldB) return order === 'desc' ? -1 : 1;
        return 0;
    });
};


const validateCategoriesExistence = (item) => {
    const domains = connector.readAll('domains').map(domain => domain.id);
    const licenses = connector.readAll('licenses').map(license => license.id);
    const languages = connector.readAll('languages').map(language => language.id);

    if (!domains.includes(item.domainId)) {
        throw new Error(`Domain with id ${item.domainId} does not exist`);
    }

    if (!licenses.includes(item.licenseId)) {
        throw new Error(`License with id ${item.licenseId} does not exist`);
    }

    if (!languages.includes(item.languageId)) {
        throw new Error(`Language with id ${item.languageId} does not exist`);
    }
};

export const createLot = (req, res) => {
    try {
        const lotData = lotSchema.parse(req.body);

        validateCategoriesExistence(lotData.item);

        const newLot = connector.create('lots', lotData);
        res.status(201).json({
            message: 'Lot created successfully',
            lot: newLot
        });
    } catch (error) {
        handleError(res, error);
    }
};



export const updateLot = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);

        if (!lot) {
            return res.status(404).json({ error: `Lot with id ${id} not found` });
        }

        const partialLotSchema = lotSchema.partial();
        const updatedData = partialLotSchema.parse(req.body);

        if (updatedData.item) {
            validateCategoriesExistence(updatedData.item);
        }

        const updatedLot = connector.update('lots', id, updatedData);

        res.status(200).json({
            message: 'Lot updated successfully',
            lot: updatedLot
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getAllLots = (req, res) => {
    try {
        let lots = connector.readAll('lots');
        const { query, domainId, licenseId, languageId, minPrice, maxPrice, sortBy, order } = req.query;

        lots = filterByQuery(lots, query);
        lots = filterByCategories(lots, 'domainId', domainId);
        lots = filterByCategories(lots, 'licenseId', licenseId);
        lots = filterByCategories(lots, 'languageId', languageId);
        lots = filterByPriceRange(lots, minPrice, maxPrice);
        lots = sortLots(lots, sortBy, order);

        res.status(200).json(lots);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getLotById = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);

        if (!lot) {
            return res.status(404).json({ error: `Lot with id ${id} not found` });
        }

        res.status(200).json(lot);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getLotBids = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);

        if (!lot) {
            return res.status(404).json({ error: `Lot with id ${id} not found` });
        }

        const bids = connector.readAll('bids').filter(bid => bid.lotId === id);

        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteLot = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);

        if (!lot) {
            return res.status(404).json({ error: `Lot with id ${id} not found` });
        }

        connector.delete('lots', id);

        res.status(200).json({ message: `Lot with id ${id} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};