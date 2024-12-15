<script>
    import {onMount, onDestroy} from 'svelte';
    import SummaryBar from '../components/dashboard/SummaryBar.svelte';
    import Section from '../components/dashboard/Section.svelte';
    import {calculateTimeLeft, mapCategories} from '../utils/utils.js';
    import {user} from '../utils/auth';

    let bids = [];
    let lots = {};
    let wonLots = [];
    let activeBids = [];
    let categories = {domains: [], licenses: [], languages: []};
    let intervalId;
    let userEmail = '';
    let totalPayment = 0;

    const fetchCategories = async () => {
        const res = await fetch('http://localhost:3000/api/categories');
        categories = await res.json();
    };

    const fetchBids = async () => {
        const res = await fetch('http://localhost:3000/api/bids', {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        });
        bids = await res.json();
        await fetchLots();
    };

    const fetchLots = async () => {
        const lotRequests = bids.map(bid =>
            fetch(`http://localhost:3000/api/lots/${bid.lotId}`).then(res => res.json())
        );
        const lotDetails = await Promise.all(lotRequests);

        lotDetails.forEach(lot => {
            lots[lot.id] = lot;
        });

        await fetchTopBidsForLots();
    };

    const fetchTopBidsForLots = async () => {
        const lotIds = Object.keys(lots);
        const topBidsRequests = lotIds.map(lotId =>
            fetch(`http://localhost:3000/api/lots/${lotId}/bids`).then(res => res.json())
        );

        const allBidsForLots = await Promise.all(topBidsRequests);

        allBidsForLots.forEach((bidsForLot, index) => {
            const lotId = lotIds[index];
            const topBid = Math.max(...bidsForLot.map(bid => bid.amount), lots[lotId]?.minBid || 0);
            lots[lotId].topBid = topBid;
        });

        processBids();
    };

    const processBids = () => {
        const now = new Date();

        wonLots = bids.filter(bid => bid.amount >= lots[bid.lotId]?.minBid && new Date(lots[bid.lotId]?.end) < now).map(bid => ({
            ...lots[bid.lotId],
            userBid: bid.amount,
            topBid: lots[bid.lotId]?.topBid,
            timeLeft: calculateTimeLeft(lots[bid.lotId]?.end),
            category: mapCategories(lots[bid.lotId]?.item, categories)
        }));

        activeBids = bids.filter(bid => new Date(lots[bid.lotId]?.end) > now).map(bid => ({
            ...lots[bid.lotId],
            userBid: bid.amount,
            topBid: lots[bid.lotId]?.topBid,
            timeLeft: calculateTimeLeft(lots[bid.lotId]?.end),
            category: mapCategories(lots[bid.lotId]?.item, categories)
        }));

        totalPayment = wonLots.reduce((total, lot) => total + lot.userBid, 0);
    };

    onMount(async () => {
        user.subscribe(u => userEmail = u?.email || 'Unknown');
        await fetchCategories();
        await fetchBids();

        intervalId = setInterval(() => {
            activeBids = activeBids.map(bid => ({
                ...bid,
                timeLeft: calculateTimeLeft(bid.end)
            }));
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<main>
    <SummaryBar totalBids={bids.length} totalPayment={totalPayment} userEmail={userEmail}/>

    <div class="content">
        <Section title="Won Lots" lots={wonLots} emptyMessage="You have no won lots."/>
        <Section title="Active Bids" lots={activeBids} emptyMessage="You have no active bids."/>
    </div>
</main>

<style>
    .content {
        display: flex;
        gap: 1rem;
    }
</style>
