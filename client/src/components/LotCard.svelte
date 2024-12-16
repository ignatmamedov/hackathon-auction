<script>
    export let lot;
    export let imgUrl;
    export let name;
    export let description;
    export let endDate;
    export let timeLeft;
    export let minBid;
    export let domain;
    export let license;
    export let language;
    export let onDetailsClick;
    export let onDeleteClick;
    export let onEditClick;
    export let isAdmin = false;
</script>

<div class="flex border rounded-lg shadow-md overflow-hidden transform scale-100">
    <div class="w-1/5">
        <img src={imgUrl} alt={name} class="object-cover w-full h-full"/>
    </div>

    <div class="w-2/5 p-4 flex flex-col text-xs md:text-sm lg:text-base">
        <h2 class="text-xl md:text-2xl font-bold text-left">{name}</h2>
        <p class="text-xs md:text-sm text-gray-500 mt-2 text-left">{description}</p>

        <div class="flex flex-wrap gap-1 mt-auto">
            <span class="border rounded-full px-2 py-0.5 text-[10px] md:text-xs text-gray-600">{domain}</span>
            <span class="border rounded-full px-2 py-0.5 text-[10px] md:text-xs text-gray-600">{license}</span>
            <span class="border rounded-full px-2 py-0.5 text-[10px] md:text-xs text-gray-600">{language}</span>
        </div>
    </div>

    <div class="w-1/5 flex flex-col items-center p-4 space-y-2">
        <div class="flex flex-col items-center">
            <p class="text-[10px] md:text-xs text-gray-500 font-semibold">
                End Date
            </p>
            <div class="text-center border rounded-full px-2 py-1 text-[10px] md:text-xs font-bold text-gray-800 mt-1">
                {endDate.split('T')[0]}
            </div>
        </div>

        <div class="flex flex-col items-center">
            <p class="text-[10px] md:text-xs text-gray-500 font-semibold">
                Time Left
            </p>
            <div class="text-center border rounded-full px-2 py-1 text-[10px] md:text-xs font-bold text-gray-800 mt-1">
                {timeLeft}
            </div>
        </div>
    </div>

    <div class="w-1/5 flex flex-col items-center justify-between p-4">
        <p class="text-[10px] md:text-sm font-semibold text-gray-500">Top Bid</p>
        <p class="text-xs md:text-lg font-bold text-gray-800">{minBid}</p>
        <button
                class="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-md shadow-md hover:bg-blue-600"
                on:click={onDetailsClick}>
            Bid Now
        </button>
        <button
                class="mt-2 border px-3 py-1 md:px-4 md:py-2 rounded-md text-gray-600 hover:bg-gray-100"
                on:click={onDetailsClick}
        >
            Details
        </button>
    </div>

    {#if isAdmin}
        <div class="w-1/5 flex flex-col justify-center items-center space-y-2 p-4 bg-gray-50">
            <button
                    class="w-full bg-yellow-400 text-black px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-yellow-500"
                    on:click={() => onEditClick(lot)}
            >
                Edit
            </button>
            <button
                    class="w-full bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-red-600"
                    on:click={onDeleteClick}
            >
                Delete
            </button>
        </div>
    {/if}
</div>
