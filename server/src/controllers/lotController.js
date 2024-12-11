import { DBConnector } from "../database/connector.js";
import { lotSchema } from "../validators/lotValidator.js";
import { handleError, createErrorResponse } from "../utils/errorHandler.js";

const connector = new DBConnector();

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

export const updateLot = (req, res) => {
    try {
        const { id } = req.params;
        const lot = connector.read('lots', id);

        if (!lot) throw createErrorResponse(404, `Lot with id ${id} not found`);

        const partialLotSchema = lotSchema.partial();
        const updatedData = partialLotSchema.parse(req.body);

        if (updatedData.item) {
            isCategoryExist(updatedData.item);
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
        res.status(200).json(lots);
    } catch (error) {
        handleError(res, error);
    }
};

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
