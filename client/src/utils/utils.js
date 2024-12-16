export const URL = `http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}`;

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

export const mapCategories = (item, categories) => {
    return {
        domain: categories.domains.find(d => d.id === item.domainId)?.name || 'Unknown',
        license: categories.licenses.find(l => l.id === item.licenseId)?.type || 'Unknown',
        language: categories.languages.find(l => l.id === item.languageId)?.name || 'Unknown'
    };
};
