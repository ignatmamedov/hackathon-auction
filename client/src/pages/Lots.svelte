<script>
    import {onMount} from 'svelte';
    import LotList from '../components/dashboard/LotList.svelte';
    import FilterBar from '../components/FilterBar.svelte';
    import EditForm from '../components/AuthForm.svelte';
    import {calculateTimeLeft, mapCategories} from '../utils/utils.js';
    import {user} from '../utils/auth';

    let lots = [];
    let categories = {domains: [], licenses: [], languages: []};
    let searchQuery = '';
    let filters = {domainIds: [], licenseIds: [], languageIds: []};
    let currentUser = null;
    let intervalId;
    let editingLot = null;
    let fields = [];

    const formatDateTimeLocal = (date) => new Date(date).toISOString().slice(0, 16);

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
        filters = {...newFilters};
        await fetchLots();
    };

    const goToDetails = (id) => {
        window.location.href = `/lots/${id}`;
    };

    const deleteLot = async (id) => {
        try {
            await fetch(`http://localhost:3000/api/lots/${id}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
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
        editingLot = lot;
        fields = [
            {id: 'name', type: 'text', value: lot.item.name, label: 'Name', required: true},
            {id: 'description', type: 'text', value: lot.item.description, label: 'Description', required: true},
            {id: 'imgUrl', type: 'url', value: lot.item.imgUrl, label: 'Image URL', required: true},
            {
                id: 'domainId',
                type: 'select',
                value: lot.item.domainId,
                label: 'Domain',
                options: categories.domains.map(d => ({value: d.id, label: d.name})),
                required: true
            },
            {
                id: 'licenseId',
                type: 'select',
                value: lot.item.licenseId,
                label: 'License',
                options: categories.licenses.map(l => ({value: l.id, label: l.type})),
                required: true
            },
            {
                id: 'languageId',
                type: 'select',
                value: lot.item.languageId,
                label: 'Language',
                options: categories.languages.map(l => ({value: l.id, label: l.name})),
                required: true
            },
            {
                id: 'start',
                type: 'datetime-local',
                value: formatDateTimeLocal(lot.start),
                label: 'Start Date',
                required: true
            },
            {id: 'end', type: 'datetime-local', value: formatDateTimeLocal(lot.end), label: 'End Date', required: true},
            {id: 'minBid', type: 'number', value: lot.minBid, label: 'Min Bid', required: true}
        ];
    };

    const openAddModal = () => {
        editingLot = {}; // новый лот
        fields = [
            {id: 'name', type: 'text', value: '', label: 'Name', required: true},
            {id: 'description', type: 'text', value: '', label: 'Description', required: true},
            {id: 'imgUrl', type: 'url', value: '', label: 'Image URL', required: true},
            {
                id: 'domainId',
                type: 'select',
                value: '',
                label: 'Domain',
                options: categories.domains.map(d => ({value: d.id, label: d.name})),
                required: true
            },
            {
                id: 'licenseId',
                type: 'select',
                value: '',
                label: 'License',
                options: categories.licenses.map(l => ({value: l.id, label: l.type})),
                required: true
            },
            {
                id: 'languageId',
                type: 'select',
                value: '',
                label: 'Language',
                options: categories.languages.map(l => ({value: l.id, label: l.name})),
                required: true
            },
            {id: 'start', type: 'datetime-local', value: '', label: 'Start Date', required: true},
            {id: 'end', type: 'datetime-local', value: '', label: 'End Date', required: true},
            {id: 'minBid', type: 'number', value: '', label: 'Min Bid', required: true}
        ];
    };

    const closeEditModal = () => {
        editingLot = null;
    };

    const saveLotChanges = async () => {
        try {
            const payload = {
                item: {
                    name: fields.find(f => f.id === 'name').value,
                    description: fields.find(f => f.id === 'description').value,
                    imgUrl: fields.find(f => f.id === 'imgUrl').value,
                    domainId: Number(fields.find(f => f.id === 'domainId').value),
                    licenseId: Number(fields.find(f => f.id === 'licenseId').value),
                    languageId: Number(fields.find(f => f.id === 'languageId').value)
                },
                start: new Date(fields.find(f => f.id === 'start').value).toISOString(),
                end: new Date(fields.find(f => f.id === 'end').value).toISOString(),
                minBid: Number(fields.find(f => f.id === 'minBid').value)
            };

            const method = editingLot.id ? 'PATCH' : 'POST';
            const url = editingLot.id
                ? `http://localhost:3000/api/lots/${editingLot.id}`
                : `http://localhost:3000/api/lots`;

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            editingLot = null;
            await fetchLots();
        } catch (error) {
            console.error('Error saving lot:', error);
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
        {#if currentUser?.isAdmin}
            <button on:click={openAddModal}>Add</button>
        {/if}
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
                    {lots}
                    emptyMessage="No lots available at the moment."
                    onDetailsClick={goToDetails}
                    onDeleteClick={deleteLot}
                    onEditClick={openEditModal}
                    isAdmin={currentUser?.isAdmin}
            />
        </div>
    </div>

    {#if editingLot}
        <div class="modal">
            <div class="modal-content">
                <button class="close-button" on:click={closeEditModal}>X</button>
                <EditForm
                        bind:fields
                        onSubmit={saveLotChanges}
                        buttonText="Save Changes"
                />
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
