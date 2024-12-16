<script>
    import {onMount, onDestroy} from 'svelte';
    import {user, isLoggedIn} from '../utils/auth';
    import {calculateTimeLeft, mapCategories} from '../utils/utils';
    import ErrorMessage from '../components/ErrorMessage.svelte';

    export let params;

    let lotId = params.id;
    let lot = null;
    let bids = [];
    let errorMessage = '';
    let categories = {domains: [], licenses: [], languages: []};
    let userEmail = '';
    let currentUser = null;
    let newBidAmount = '';
    let bidError = '';
    let timeLeft = '';
    let eventSource;
    let timeInterval;

    async function fetchCategories() {
        const res = await fetch('http://localhost:3000/api/categories');
        if (!res.ok) {
            console.error('Failed to load categories');
            return;
        }
        categories = await res.json();
    }

    async function fetchLot() {
        const res = await fetch(`http://localhost:3000/api/lots/${lotId}`);
        if (!res.ok) {
            errorMessage = 'Lot not found or error while fetching lot.';
            return;
        }
        lot = await res.json();
        lot.minBid = Number(lot.minBid);
        updateTime();
    }

    async function fetchBids() {
        const res = await fetch(`http://localhost:3000/api/lots/${lotId}/bids`);
        if (!res.ok) {
            console.error('Failed to fetch bids');
            return;
        }
        bids = await res.json();
        bids = bids.map(b => ({...b, amount: Number(b.amount)}));
        updateTopBid();
    }

    function updateTopBid() {
        if (!lot) return;
        const topBidAmount = bids.length > 0 ? Math.max(...bids.map(b => Number(b.amount))) : lot.minBid;
        lot.topBid = topBidAmount;
    }

    $: user.subscribe(u => {
        currentUser = u;
        userEmail = u?.email || '';
    });

    async function placeBid() {
        bidError = '';
        const bidValue = Number(newBidAmount);

        if (!bidValue || bidValue <= 0) {
            bidError = 'Please enter a valid bid amount.';
            return;
        }

        if (bidValue <= lot.topBid) {
            bidError = 'Your bid must be higher than the current top bid.';
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                bidError = 'User is not authenticated. Please log in again.';
                return;
            }

            const body = JSON.stringify({lotId, amount: bidValue});
            const res = await fetch(`http://localhost:3000/api/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error?.message || 'Failed to place bid');
            }

            await fetchBids();
            newBidAmount = '';
        } catch (err) {
            console.error('Error placing bid:', err);
            bidError = err.message;
        }
    }

    function updateTime() {
        if (lot) {
            timeLeft = calculateTimeLeft(lot.end);
        }
    }

    onMount(async () => {
        await fetchCategories();
        await fetchLot();
        await fetchBids();
        updateTime();

        timeInterval = setInterval(updateTime, 1000);

        eventSource = new EventSource('http://localhost:3000/api/bids/updates');

        eventSource.onmessage = (event) => {
            const newBid = JSON.parse(event.data);
            if (newBid.lotId.toString() === lotId.toString()) {
                bids = [...bids, {...newBid, amount: Number(newBid.amount)}];
                updateTopBid();
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
        };
    });

    onDestroy(() => {
        if (eventSource) eventSource.close();
        if (timeInterval) clearInterval(timeInterval);
    });
</script>

<main class="min-h-screen bg-gray-100 p-6">
    {#if errorMessage}
        <ErrorMessage message={errorMessage} />
    {/if}

    {#if lot}
        <div class="grid grid-cols-3 gap-8">
            <div class="space-y-4">
                <div class="border rounded-lg overflow-hidden shadow-md">
                    <img src={lot.item.imgUrl} alt={lot.item.name} class="w-full object-cover" />
                </div>

                <div class="flex justify-center gap-4">

                    <div class="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold shadow-md text-xs overflow-hidden whitespace-nowrap truncate">
                        {categories.domains.find(d => d.id === lot.item.domainId)?.name || 'Domain'}
                    </div>

                    <div class="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 text-white font-bold shadow-md text-xs overflow-hidden whitespace-nowrap truncate">
                        {categories.licenses.find(l => l.id === lot.item.licenseId)?.type || 'License'}
                    </div>

                    <div class="w-16 h-16 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold shadow-md text-xs overflow-hidden whitespace-nowrap truncate">
                        {categories.languages.find(l => l.id === lot.item.languageId)?.name || 'Language'}
                    </div>
                </div>
            </div>

            <div class="space-y-4 bg-white p-6 rounded-lg shadow-md">
                <h1 class="text-2xl font-bold text-gray-800">{lot.item.name}</h1>
                <p class="text-gray-600">{lot.item.description}</p>
                <div class="text-gray-700">
                    <p><strong>Min Bid:</strong> ${lot.minBid}</p>
                    <p><strong>Current Top Bid:</strong> ${lot.topBid ?? lot.minBid}</p>
                    <p><strong>Time Left:</strong> {timeLeft}</p>
                </div>
            </div>

            <div class="space-y-4 bg-white p-6 rounded-lg shadow-md h-full">
                <h2 class="text-lg font-semibold text-gray-800">Bids</h2>
                <div class="overflow-y-auto max-h-64 space-y-2">
                    {#if bids.length > 0}
                        {#each bids as bid}
                            <div class="p-2 border rounded-md shadow-sm">
                                <p class="text-sm"><strong>Bidder:</strong> {bid.userId}</p>
                                <p class="text-sm"><strong>Amount:</strong> ${bid.amount}</p>
                                <p class="text-xs text-gray-500">{bid.timestamp}</p>
                            </div>
                        {/each}
                    {:else}
                        <p class="text-gray-500 text-sm">No bids yet. Be the first!</p>
                    {/if}
                </div>

                {#if $isLoggedIn && !currentUser.isAdmin}
                    <div class="space-y-2">
                        <input
                                type="number"
                                bind:value={newBidAmount}
                                min={lot.topBid ?? lot.minBid}
                                step="1"
                                placeholder="Enter your bid"
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                                on:click={placeBid}
                                class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            Place Bid
                        </button>
                        {#if bidError}
                            <ErrorMessage message={bidError} />
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</main>

