<script>
    import { onMount } from 'svelte';
    import { lots, categories, searchQuery, filters, fetchLots, fetchCategories, updateTimeLeft } from '../utils/lotsStore.js';
    import { user } from '../utils/auth';
    import LotList from '../components/dashboard/LotList.svelte';
    import FilterBar from '../components/FilterBar.svelte';
    import LotModal from '../components/LotModal.svelte';
    import Button from '../components/Button.svelte';
    import {URL} from "../utils/utils.js";

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
        await fetch(`${URL}/api/lots/${id}`, {
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
        const url = id ? `${URL}/api/lots/${id}` : `${URL}/api/lots`;
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

<main class="min-h-screen bg-gray-100 flex">
    <aside class="w-[300px] bg-white border border-gray-200 rounded-lg p-4 m-4 shadow-md self-start">
        <h3 class="text-lg font-semibold mb-4">Filters</h3>
        <FilterBar
                filters={$filters}
                categories={$categories}
                searchQuery={$searchQuery}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
        />
    </aside>

    <div class="flex-1 bg-white rounded-lg m-4 shadow-md">
        <div class="flex flex-col">
            <header class="p-4 border-b border-gray-200">
                <div class="flex flex-col w-full">
                    <input
                            type="text"
                            bind:value={$searchQuery}
                            placeholder="Search for lots..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            on:input={() => handleSearch($searchQuery)}
                    />

                    {#if currentUser?.isAdmin}
                        <Button
                                text="Add Lot"
                                onClick={openAddModal}
                                class="mt-2 w-full bg-emerald-600 text-white text-xs py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    {/if}
                </div>
            </header>

            <div class="p-4">
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


