<script>
    export let filters = { domainIds: [], licenseIds: [], languageIds: [] };
    export let categories = { domains: [], licenses: [], languages: [] };
    export let searchQuery = '';
    export let onSearch;
    export let onFilterChange;

    const handleCheckboxChange = (categoryType, id) => {
        const updatedFilters = { ...filters };
        updatedFilters[categoryType] = updatedFilters[categoryType].includes(id)
            ? updatedFilters[categoryType].filter(item => item !== id)
            : [...updatedFilters[categoryType], id];

        onFilterChange(updatedFilters);
    };
</script>

<div class="filters">
    <div class="filter-group">
        <h3>Domains</h3>
        {#each categories.domains as domain}
            <label>
                <input
                        type="checkbox"
                        checked={filters.domainIds.includes(domain.id)}
                        on:change={() => handleCheckboxChange('domainIds', domain.id)}
                />
                {domain.name}
            </label>
        {/each}
    </div>

    <div class="filter-group">
        <h3>Licenses</h3>
        {#each categories.licenses as license}
            <label>
                <input
                        type="checkbox"
                        checked={filters.licenseIds.includes(license.id)}
                        on:change={() => handleCheckboxChange('licenseIds', license.id)}
                />
                {license.type}
            </label>
        {/each}
    </div>

    <div class="filter-group">
        <h3>Languages</h3>
        {#each categories.languages as language}
            <label>
                <input
                        type="checkbox"
                        checked={filters.languageIds.includes(language.id)}
                        on:change={() => handleCheckboxChange('languageIds', language.id)}
                />
                {language.name}
            </label>
        {/each}
    </div>
</div>

<style>
    .filters {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .filter-group {
        background-color: #f9f9f9;
        padding: 1rem;
        border-radius: 8px;
    }

    h3 {
        margin-bottom: 0.5rem;
    }

    label {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    label input[type="checkbox"] {
        margin-right: 0.5rem;
    }
</style>
