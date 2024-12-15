import { writable, get } from 'svelte/store';
import { calculateTimeLeft, mapCategories } from './utils.js';

export const lots = writable([]);
export const categories = writable({ domains: [], licenses: [], languages: [] });
export const searchQuery = writable('');
export const filters = writable({ domainIds: [], licenseIds: [], languageIds: [] });

function buildQueryParams(searchQueryValue, filtersValue) {
    const params = new URLSearchParams();
    if (searchQueryValue) params.append('query', searchQueryValue);
    filtersValue.domainIds.forEach(id => params.append('domainId', id));
    filtersValue.licenseIds.forEach(id => params.append('licenseId', id));
    filtersValue.languageIds.forEach(id => params.append('languageId', id));
    return params.toString();
}

export async function fetchCategories() {
    try {
        const res = await fetch('http://localhost:3000/api/categories');
        categories.set(await res.json());
    } catch {}
}

export async function fetchLots() {
    try {
        const query = buildQueryParams(get(searchQuery), get(filters));
        const res = await fetch(`http://localhost:3000/api/lots?${query}`);
        const data = await res.json();
        const cats = get(categories);
        lots.set(data.map(lot => ({
            ...lot,
            timeLeft: calculateTimeLeft(lot.end),
            category: mapCategories(lot.item, cats)
        })));
    } catch {}
}

export function updateTimeLeft() {
    lots.update(currentLots => currentLots.map(lot => ({
        ...lot,
        timeLeft: calculateTimeLeft(lot.end)
    })));
}
