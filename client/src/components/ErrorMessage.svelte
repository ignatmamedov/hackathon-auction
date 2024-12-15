<script>
    export let message = '';
</script>

{#if message}
    <div class="error">{message}</div>
{/if}