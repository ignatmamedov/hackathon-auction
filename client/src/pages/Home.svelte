<script>
    import { onMount } from 'svelte';
    import { lots, categories, searchQuery, filters, fetchLots, fetchCategories, updateTimeLeft } from '../utils/lotsStore.js';
    import { user } from '../utils/auth';
    import LotList from '../components/dashboard/LotList.svelte';
    import FilterBar from '../components/FilterBar.svelte';
    import LotModal from '../components/LotModal.svelte';
    import Button from '../components/Button.svelte';

    let currentUser = null;
    let intervalId;
    let showModal = false;
    let editingLot = null;

    onMount(async () => {
        user.subscribe(u => currentUser = u);
        await fetchCategories();
        await fetchLots();
        intervalId = setInterval(() => updateTimeLeft(), 1000);
    });

    async function handleSearch(query) {
        searchQuery.set(query);
        await fetchLots();
    }

    async function handleFilterChange(newFilters) {
        filters.set(newFilters);
        await fetchLots();
    }

    function goToDetails(id) {
        window.location.href = `/lots/${id}`;
    }

    async function deleteLot(id) {
        await fetch(`http://localhost:3000/api/lots/${id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });
        await fetchLots();
    }

    function openEditModal(lot) {
        editingLot = lot;
        showModal = true;
    }

    function openAddModal() {
        editingLot = {};
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        editingLot = null;
    }

    async function saveLotChanges(payload, id) {
        const method = id ? 'PATCH' : 'POST';
        const url = id ? `http://localhost:3000/api/lots/${id}` : `http://localhost:3000/api/lots`;
        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });
        await fetchLots();
    }
</script>

<main>
    <header class="search-bar">
        <input
                type="text"
                bind:value={$searchQuery}
                placeholder="Search for lots..."
                on:input={() => handleSearch($searchQuery)}
        />
        {#if currentUser?.isAdmin}
            <Button text="Add" onClick={openAddModal} />
        {/if}
    </header>
    <div class="content-wrapper">
        <aside class="filter-wrapper">
            <FilterBar
                    filters={$filters}
                    categories={$categories}
                    searchQuery={$searchQuery}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
            />
        </aside>
        <div class="lot-list-wrapper">
            <LotList
                    title="Available Lots"
                    lots={$lots}
                    emptyMessage="No lots available at the moment."
                    onDetailsClick={goToDetails}
                    onDeleteClick={deleteLot}
                    onEditClick={openEditModal}
                    isAdmin={currentUser?.isAdmin}
            />
        </div>
    </div>
    {#if showModal}
        <LotModal
                {editingLot}
                categories={$categories}
                onClose={closeModal}
                onSave={saveLotChanges}
        />
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
        gap: 1rem;
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
</style>
