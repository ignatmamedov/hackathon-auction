<script>
    export let imgUrl;
    export let name;
    export let description;
    export let endDate;
    export let timeLeft;
    export let userBid;
    export let topBid;
    export let domain;
    export let license;
    export let language;
    export let status;
    export let onDetailsClick;
    export let showDetailsButton;
</script>

<div class="lot-card">
    <img src={imgUrl} alt={name}/>
    <div class="lot-info">
        <h2>{name}</h2>
        <p>{description}</p>
        <p>Ends: {endDate} ({timeLeft})</p>
        <p>Top Bid:{topBid}</p>
        <p>Your Bid:{userBid}</p>
        <p>Domain: {domain}</p>
        <p>License: {license}</p>
        <p>Language: {language}</p>
        {#if status === 'win'}<p class="status win">You Won</p>{/if}
        {#if showDetailsButton}
            <button on:click={onDetailsClick}>Details</button>
        {/if}
    </div>
</div>

<style>
    .lot-card {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        padding: 1rem;
        margin: 1rem;
        border-radius: 8px;
    }
    .lot-image {
        width: 100px;
        height: 100px;
        margin-right: 1rem;
    }
    .lot-info {
        flex: 1;
    }
    .tags {
        display: flex;
        gap: 0.5rem;
    }
    .lot-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .status {
        font-weight: bold;
    }
    .win {
        color: green;
    }
</style>
