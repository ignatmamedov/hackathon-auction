<script>
    import LotCard from '../LotCard.svelte';

    export let title;
    export let lots;
    export let emptyMessage;
    export let onDetailsClick;
    export let onDeleteClick;
    export let onEditClick;
    export let isAdmin = false;
</script>

<section class="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h1>

    {#if lots.length > 0}
        <div class="flex flex-col space-y-6">
            {#each lots as lot}
                <LotCard
                        {lot}
                        imgUrl={lot.item.imgUrl}
                        name={lot.item.name}
                        description={lot.item.description}
                        endDate={lot.end}
                        timeLeft={lot.timeLeft}
                        minBid={lot.minBid}
                        userBid={lot.userBid}
                        domain={lot.category.domain}
                        license={lot.category.license}
                        language={lot.category.language}
                        status={title === 'Won Lots' ? 'win' : ''}
                        showDetailsButton={true}
                        onDetailsClick={() => onDetailsClick(lot.id)}
                        onDeleteClick={() => onDeleteClick(lot.id)}
                        onEditClick={() => onEditClick(lot)}
                        isAdmin={isAdmin}
                        class="shadow-md hover:shadow-lg transition-shadow duration-300"
                />
            {/each}
        </div>
    {:else}
        <p class="text-center text-gray-500 text-lg mt-10">{emptyMessage}</p>
    {/if}
</section>
