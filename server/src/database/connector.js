import { db } from "./mockDB.js";
import { v4 as uuidv4 } from 'uuid';

export class DBConnector {
    get(tableName) {
        if (!db[tableName]) {
            throw new Error(`Table ${tableName} does not exist in the database`);
        }
        return db[tableName];
    }

    getNextIncrementalId(tableName) {
        const table = this.get(tableName);
        if (table.length === 0) return 0;
        return table[table.length - 1].id + 1;
    }

    create(tableName, data, isIncrement = false) {
        const table = this.get(tableName);
        const id = isIncrement ? this.getNextIncrementalId(tableName) : uuidv4();
        const newEntity = { ...data, id };
        table.push(newEntity);
        return newEntity;
    }

    read(tableName, id) {
        const table = this.get(tableName);
        return table.find(entity => entity.id === id) || null;
    }

    readAll(tableName) {
        return this.get(tableName);
    }

    update(tableName, id, newData) {
        const table = this.get(tableName);
        const index = table.findIndex(entity => entity.id === id);
        if (index === -1) return null;

        table[index] = { ...table[index], ...newData };
        return table[index];
    }

    delete(tableName, id) {
        const table = this.get(tableName);
        const index = table.findIndex(entity => entity.id === id);
        if (index === -1) return null;

        return table.splice(index, 1)[0];
    }
}
