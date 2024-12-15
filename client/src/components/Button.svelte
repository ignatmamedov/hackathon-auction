<script>
    export let text = '';
    export let onClick = () => {};
    export let type = 'button';
</script>

<button type={type} on:click={onClick}>{text}</button>
