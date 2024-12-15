<script>
    import InputField from './InputField.svelte';
    import SubmitButton from './SubmitButton.svelte';
    import ErrorMessage from './ErrorMessage.svelte';

    export let onSubmit;
    export let fields = [];
    export let buttonText = 'Submit';
    export let errorMessage = '';

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit();
    };
</script>

<form on:submit={handleSubmit}>
    <ErrorMessage message={errorMessage} />

    {#each fields as field}
        <InputField
                id={field.id}
                type={field.type}
                bind:value={field.value}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
        />
    {/each}

    <SubmitButton text={buttonText} />
</form>
