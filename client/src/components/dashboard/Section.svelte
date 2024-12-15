<script>
    import LotCard from "../LotCard.svelte";

    export let title;
    export let lots;
    export let emptyMessage;
    export let onDetailsClick;
</script>

<section>
    <h1>{title}</h1>
    {#if lots.length > 0}
        {#each lots as lot}
            <LotCard
                    imgUrl={lot.item.imgUrl}
                    name={lot.item.name}
                    description={lot.item.description}
                    endDate={lot.end}
                    userBid={lot.userBid}
                    topBid={lot.topBid}
                    timeLeft={lot.timeLeft}
                    domain={lot.category.domain}
                    license={lot.category.license}
                    language={lot.category.language}
                    status={title === 'Won Lots' ? 'win' : ''}
                    showDetailsButton={true}
                    onDetailsClick={() => onDetailsClick(lot.id)}
            />
        {/each}
    {:else}
        <p>{emptyMessage}</p>
    {/if}
</section>

<style>
    section {
        flex: 1;
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    h1 {
        margin-bottom: 1rem;
    }

    p {
        margin-top: 1rem;
    }
</style>
