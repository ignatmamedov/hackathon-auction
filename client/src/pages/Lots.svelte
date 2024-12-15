<script>
    import { onMount } from 'svelte';
    import LotList from '../components/dashboard/LotList.svelte';
    import FilterBar from '../components/FilterBar.svelte';
    import EditForm from '../components/AuthForm.svelte';
    import { calculateTimeLeft, mapCategories } from '../utils/utils.js';
    import { user } from '../utils/auth';

    let lots = [];
    let categories = { domains: [], licenses: [], languages: [] };
    let searchQuery = '';
    let filters = { domainIds: [], licenseIds: [], languageIds: [] };
    let currentUser = null;
    let intervalId;
    let editingLot = null;

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/categories');
            categories = await res.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const buildQueryParams = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('query', searchQuery);
        filters.domainIds.forEach(id => params.append('domainId', id));
        filters.licenseIds.forEach(id => params.append('licenseId', id));
        filters.languageIds.forEach(id => params.append('languageId', id));
        return params.toString();
    };

    const fetchLots = async () => {
        try {
            const query = buildQueryParams();
            const res = await fetch(`http://localhost:3000/api/lots?${query}`);
            const result = await res.json();
            lots = result.map(lot => ({
                ...lot,
                timeLeft: calculateTimeLeft(lot.end),
                category: mapCategories(lot.item, categories)
            }));
        } catch (error) {
            console.error('Error fetching lots:', error);
        }
    };

    const updateTimeLeft = () => {
        lots = lots.map(lot => ({
            ...lot,
            timeLeft: calculateTimeLeft(lot.end)
        }));
    };

    const handleSearch = async (query) => {
        searchQuery = query;
        await fetchLots();
    };

    const handleFilterChange = async (newFilters) => {
        filters = { ...newFilters };
        await fetchLots();
    };

    const goToDetails = (id) => {
        window.location.href = `/lots/${id}`;
    };

    const deleteLot = async (id) => {
        try {
            await fetch(`http://localhost:3000/api/lots/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            await fetchLots();
        } catch (error) {
            console.error('Error deleting lot:', error);
        }
    };

    const openEditModal = (lot) => {
        if (!lot || !lot.item) {
            console.error('Lot or its item is undefined', lot);
            return;
        }
        editingLot = {
            id: lot.id,
            minBid: lot.minBid ?? 0, // Устанавливаем значение по умолчанию, если lot.minBid не определен
            item: {
                name: lot.item?.name ?? '', // Безопасный доступ с fallback
                description: lot.item?.description ?? '' // Безопасный доступ с fallback
            }
        };
    };

    const closeEditModal = () => {
        editingLot = null;
    };

    const saveLotChanges = async () => {
        try {
            await fetch(`http://localhost:3000/api/lots/${editingLot.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editingLot)
            });
            editingLot = null;
            await fetchLots();
        } catch (error) {
            console.error('Error updating lot:', error);
        }
    };

    onMount(async () => {
        user.subscribe(u => {
            currentUser = u;
        });
        await fetchCategories();
        await fetchLots();
        intervalId = setInterval(() => updateTimeLeft(), 1000);
    });
</script>

<main>
    <header class="search-bar">
        <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search for lots..."
                on:input={() => handleSearch(searchQuery)}
        />
    </header>

    <div class="content-wrapper">
        <aside class="filter-wrapper">
            <FilterBar
                    {filters}
                    {categories}
                    {searchQuery}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
            />
        </aside>

        <div class="lot-list-wrapper">
            <LotList
                    title="Available Lots"
                    lots={lots}
                    emptyMessage="No lots available at the moment."
                    onDetailsClick={(id) => goToDetails(id)}
                    onDeleteClick={(id) => deleteLot(id)}
                    onEditClick={(lot) => openEditModal(lot)}
                    isAdmin={currentUser?.isAdmin}
            />
        </div>
    </div>

    {#if editingLot}
        <div class="modal">
            <div class="modal-content">
                <button class="close-button" on:click={closeEditModal}>X</button>
                <form on:submit|preventDefault={saveLotChanges}>
                    <label for="name">Name</label>
                    <input
                            id="name"
                            type="text"
                            bind:value={editingLot.item.name}
                            placeholder="Name"
                            required
                    />

                    <label for="description">Description</label>
                    <input
                            id="description"
                            type="text"
                            bind:value={editingLot.item.description}
                            placeholder="Description"
                            required
                    />

                    <label for="minBid">Min Bid</label>
                    <input
                            id="minBid"
                            type="number"
                            bind:value={editingLot.minBid}
                            placeholder="Min Bid"
                            required
                    />

                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        padding: 1rem;
    }

    .search-bar {
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
    }

    .search-bar input[type="text"] {
        width: 100%;
        max-width: 600px;
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 1rem;
    }

    .content-wrapper {
        display: flex;
        gap: 1rem;
    }

    .filter-wrapper {
        flex: 1;
        background-color: #f9f9f9;
        padding: 1rem;
        border-radius: 8px;
    }

    .lot-list-wrapper {
        flex: 3;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: #fff;
        padding: 2rem;
        border-radius: 8px;
        width: 100%;
        max-width: 600px;
        position: relative;
    }

    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: #ff5c5c;
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
</style>
