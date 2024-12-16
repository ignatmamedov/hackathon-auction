<script>
    export let id = '';
    export let type = 'text';
    export let value = '';
    export let label = '';
    export let placeholder = '';
    export let required = false;

    /**
     * Handles the input event for the input field.
     * Updates the value based on the input type.
     */
    const handleInput = (event) => {
        if (type === 'number') {
            value = event.target.value === '' ? null : event.target.valueAsNumber;
        } else {
            value = event.target.value;
        }
    };
</script>

<div class="space-y-1">
    {#if label}
        <label for={id} class="block text-sm font-medium text-gray-700">{label}</label>
    {/if}
    <input
            id={id}
            {type}
            value={value}
            placeholder={placeholder}
            required={required}
            on:input={handleInput}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
</div>
