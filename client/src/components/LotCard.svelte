<script>
    export let lot;
    export let imgUrl;
    export let name;
    export let description;
    export let endDate;
    export let timeLeft;
    export let minBid;
    export let userBid;
    export let domain;
    export let license;
    export let language;
    export let status;
    export let onDetailsClick;
    export let onDeleteClick;
    export let onEditClick;
    export let isAdmin = false;
    export let showDetailsButton;
</script>

<div class="lot-card">
    <img src={imgUrl} alt={name}/>
    <div class="lot-info">
        <h2>{name}</h2>
        <p>{description}</p>
        <p>Ends: {endDate} ({timeLeft})</p>
        <p>Top Bid: {minBid}</p>
        {#if userBid !== undefined}
            <p>Your Bid: {userBid}</p>
        {/if}
        <p>Domain: {domain}</p>
        <p>License: {license}</p>
        <p>Language: {language}</p>

        {#if status === 'win'}
            <p class="status win">You Won</p>
        {/if}

        {#if showDetailsButton}
            <button on:click={onDetailsClick}>Details</button>
        {/if}

        {#if isAdmin}
            <button class="edit-button" on:click={() => onEditClick(lot)}>Edit</button>
            <button class="delete-button" on:click={onDeleteClick}>Delete</button>
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

    .status {
        font-weight: bold;
    }

    .win {
        color: green;
    }

    .edit-button,
    .delete-button {
        margin-top: 0.5rem;
        background-color: #007bff;
        color: white;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .delete-button {
        background-color: #dc3545;
    }

    .edit-button:hover,
    .delete-button:hover {
        opacity: 0.9;
    }
</style>
