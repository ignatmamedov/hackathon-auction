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

<div class="space-y-6">
    <div class="space-y-2">
        <h3 class="text-lg font-semibold text-gray-700">Domains</h3>
        <div class="space-y-1">
            {#each categories.domains as domain}
                <label class="flex items-center space-x-2 text-gray-600 cursor-pointer">
                    <input
                            type="checkbox"
                            class="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            checked={filters.domainIds.includes(domain.id)}
                            on:change={() => handleCheckboxChange('domainIds', domain.id)}
                    />
                    <span class="text-sm">{domain.name}</span>
                </label>
            {/each}
        </div>
    </div>

    <div class="space-y-2">
        <h3 class="text-lg font-semibold text-gray-700">Licenses</h3>
        <div class="space-y-1">
            {#each categories.licenses as license}
                <label class="flex items-center space-x-2 text-gray-600 cursor-pointer">
                    <input
                            type="checkbox"
                            class="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            checked={filters.licenseIds.includes(license.id)}
                            on:change={() => handleCheckboxChange('licenseIds', license.id)}
                    />
                    <span class="text-sm">{license.type}</span>
                </label>
            {/each}
        </div>
    </div>


    <div class="space-y-2">
        <h3 class="text-lg font-semibold text-gray-700">Languages</h3>
        <div class="space-y-1">
            {#each categories.languages as language}
                <label class="flex items-center space-x-2 text-gray-600 cursor-pointer">
                    <input
                            type="checkbox"
                            class="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            checked={filters.languageIds.includes(language.id)}
                            on:change={() => handleCheckboxChange('languageIds', language.id)}
                    />
                    <span class="text-sm">{language.name}</span>
                </label>
            {/each}
        </div>
    </div>
</div>
