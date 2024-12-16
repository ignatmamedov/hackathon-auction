export const URL = `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}`;

/**
 * Calculates the time left from the current time to the given end date.
 * @param {string|Date} endDate - The end date of the event.
 * @returns {string} The formatted time left (e.g., '2h 15m 30s') or 'Ended' if the event is over.
 */
export const calculateTimeLeft = (endDate) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
};

/**
 * Maps category IDs from an item to their corresponding category names.
 * @param {Object} item - The item containing category IDs.
 * @param {Object} categories - The categories object containing domain, license, and language data.
 * @returns {Object} An object containing the category names for domain, license, and language.
 */
export const mapCategories = (item, categories) => {
    return {
        domain: categories.domains.find(d => d.id === item.domainId)?.name || 'Unknown',
        license: categories.licenses.find(l => l.id === item.licenseId)?.type || 'Unknown',
        language: categories.languages.find(l => l.id === item.languageId)?.name || 'Unknown'
    };
};
