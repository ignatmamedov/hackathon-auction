<script>
    export let message = '';
</script>

{#if message}
    <div class="text-red-500 bg-red-100 border-l-4 border-red-500 p-3 rounded-md text-sm">
        {message}
    </div>
{/if}
