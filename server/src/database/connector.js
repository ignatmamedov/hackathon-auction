import { db } from "./mockDB.js";
import { v4 as uuidv4 } from 'uuid';

/**
 * Provides CRUD operations on database.
 */
export class DBConnector {
    /**
     * Retrieves a reference to the specified table.
     *
     * @param {string} tableName - The name of the table to access.
     * @returns {Array<object>} The array of entities from the specified table.
     * @throws {Error} If the table does not exist in the database.
     */
    get(tableName) {
        if (!db[tableName]) {
            throw new Error(`Table ${tableName} does not exist in the database`);
        }
        return db[tableName];
    }

    /**
     * Retrieves the next incremental ID for a given table.
     *
     * @param {string} tableName - The name of the table.
     * @returns {number} The next incremental numeric ID.
     */
    getNextIncrementalId(tableName) {
        const table = this.get(tableName);
        if (table.length === 0) return 0;
        return table[table.length - 1].id + 1;
    }

    /**
     * Creates a new entity in the specified table.
     *
     * @param {string} tableName - The name of the table to insert into.
     * @param {object} data - The entity data to store.
     * @param {boolean} [isIncrement=false] - If true, uses a numeric incremental ID; otherwise uses a UUID.
     * @returns {object} The newly created entity with an assigned `id`.
     */
    create(tableName, data, isIncrement = false) {
        const table = this.get(tableName);
        const id = isIncrement ? this.getNextIncrementalId(tableName) : uuidv4();
        const newEntity = { ...data, id };
        table.push(newEntity);
        return newEntity;
    }

    /**
     * Reads a single entity by its ID from the specified table.
     *
     * @param {string} tableName - The name of the table.
     * @param {string|number} id - The ID of the entity to read.
     * @returns {object|null} The entity if found, otherwise null.
     */
    read(tableName, id) {
        const table = this.get(tableName);
        return table.find(entity => entity.id === id) || null;
    }

    /**
     * Reads all entities from the specified table.
     *
     * @param {string} tableName - The name of the table.
     * @returns {Array<object>} An array of all entities in the table.
     */
    readAll(tableName) {
        return this.get(tableName);
    }

    /**
     * Updates an existing entity by its ID in the specified table.
     *
     * @param {string} tableName - The name of the table.
     * @param {string|number} id - The ID of the entity to update.
     * @param {object} newData - Partial or full entity data to merge with the existing entity.
     * @returns {object|null} The updated entity if found, otherwise null.
     */
    update(tableName, id, newData) {
        const table = this.get(tableName);
        const index = table.findIndex(entity => entity.id === id);
        if (index === -1) return null;

        table[index] = { ...table[index], ...newData };
        return table[index];
    }

    /**
     * Deletes an entity by its ID from the specified table.
     *
     * @param {string} tableName - The name of the table.
     * @param {string|number} id - The ID of the entity to delete.
     * @returns {object|null} The deleted entity if found, otherwise null.
     */
    delete(tableName, id) {
        const table = this.get(tableName);
        const index = table.findIndex(entity => entity.id === id);
        if (index === -1) return null;

        return table.splice(index, 1)[0];
    }
}
