<script>
    export let text = '';
    export let onClick = () => {};
    export let type = 'button';
</script>

<button
        type={type}
        on:click={onClick}
        class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-200"
>
    {text}
</button>
