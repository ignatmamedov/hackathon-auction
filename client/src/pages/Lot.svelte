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
    });
</script>

<style>
    .lot-details {
        display: flex;
        align-items: flex-start;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .lot-image img {
        max-width: 300px;
        border-radius: 8px;
    }

    .lot-info {
        flex: 1;
    }

    .bids-section {
        margin-top: 2rem;
    }

    .bids-list {
        background: #f9f9f9;
        padding: 1rem;
        border-radius: 8px;
    }

    .bid-item {
        border-bottom: 1px solid #ccc;
        padding: 0.5rem 0;
    }

    .bid-item:last-child {
        border-bottom: none;
    }

    .bid-form {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .bid-form input {
        width: 100px;
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .error {
        color: red;
        margin-top: 0.5rem;
    }

    .countdown {
        font-weight: bold;
        color: #333;
    }
</style>

<main>
    {#if errorMessage}
        <ErrorMessage message={errorMessage}/>
    {/if}

    {#if lot}
        <div class="lot-details">
            <div class="lot-image">
                <img src={lot.item.imgUrl} alt={lot.item.name}/>
            </div>
            <div class="lot-info">
                <h1>{lot.item.name}</h1>
                <p>{lot.item.description}</p>
                <p><strong>Min Bid:</strong> {lot.minBid}</p>
                <p><strong>Current Top Bid:</strong> {lot.topBid ?? lot.minBid}</p>
            </div>
        </div>

        <div class="bids-section">
            <h2>Bids</h2>
            <div class="bids-list">
                {#if bids.length > 0}
                    {#each bids as bid}
                        <div class="bid-item">
                            <p><strong>Bidder ID:</strong> {bid.userId}</p>
                            <p><strong>Amount:</strong> {bid.amount}</p>
                            <p><strong>Placed at:</strong> {bid.timestamp}</p>
                        </div>
                    {/each}
                {:else}
                    <p>No bids yet. Be the first!</p>
                {/if}
            </div>

            {#if $isLoggedIn && !currentUser.isAdmin}
                <div class="bid-form">
                    <input
                            type="number"
                            bind:value={newBidAmount}
                            min={lot.topBid ?? lot.minBid}
                            step="1"
                            placeholder="Your bid"
                            required
                    />
                    <button on:click={placeBid}>Place Bid</button>
                </div>
                {#if bidError}
                    <div class="error">{bidError}</div>
                {/if}
            {:else}
                <p>Only bidders can place bids.</p>
            {/if}
        </div>
    {/if}
</main>
