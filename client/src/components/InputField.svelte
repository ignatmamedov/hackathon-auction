<script>
    export let id = '';
    export let type = 'text';
    export let value = '';
    export let label = '';
    export let placeholder = '';
    export let required = false;

    const handleInput = (event) => {
        if (type === 'number') {
            value = event.target.value === '' ? null : event.target.valueAsNumber;
        } else {
            value = event.target.value;
        }
    };
</script>

<label for={id}>{label}</label>
<input
        id={id}
        {type}
        value={value}
        placeholder={placeholder}
        required={required}
        on:input={handleInput}
/>