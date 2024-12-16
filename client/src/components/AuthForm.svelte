<script>
    import InputField from './InputField.svelte';
    import Button from './Button.svelte';
    import ErrorMessage from './ErrorMessage.svelte';

    export let onSubmit;
    export let fields = [];
    export let buttonText = 'Submit';
    export let errorMessage = '';

    /**
     * Handles form submission event.
     * @param {Event} event - The form submit event.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit();
    };
</script>

<form
        on:submit={handleSubmit}
        class="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-md space-y-4"
>
    {#if errorMessage}
        <ErrorMessage message={errorMessage}/>
    {/if}

    {#each fields as field}
        {#if field.type === 'select'}
            <div>
                <label for={field.id} class="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                </label>
                <select
                        id={field.id}
                        bind:value={field.value}
                        required={field.required}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {#each field.options as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>
        {:else}
            <InputField
                    id={field.id}
                    type={field.type}
                    bind:value={field.value}
                    label={field.label}
                    placeholder={field.placeholder}
                    required={field.required}
            />
        {/if}
    {/each}

    <Button text={buttonText} type="submit"/>
</form>
