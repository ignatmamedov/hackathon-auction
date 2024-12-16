<script>
    import AuthForm from '../components/AuthForm.svelte';
    import { lotSchema } from '../utils/validation.js';
    import Button from '../components/Button.svelte';

    export let editingLot = null;
    export let categories;
    export let onClose;
    export let onSave;

    /**
     * Formats a date to the "YYYY-MM-DDTHH:MM" format.
     *
     * @param {string|Date} date - The date to format.
     * @returns {string} The formatted date-time string.
     */
    function formatDateTimeLocal(date) {
        return new Date(date).toISOString().slice(0, 16);
    }

    let fields = [];
    let errorMessage = '';

    $: fields = (editingLot !== null && categories)
        ? prepareFields(editingLot, categories)
        : fields;

    /**
     * Prepares form fields for the lot edit form.
     *
     * @param {Object} lot - The lot being edited.
     * @param {Object} cats - The categories for the lot.
     * @returns {Array<Object>} The prepared form fields.
     */
    function prepareFields(lot, cats) {
        return [
            { id: 'name', type: 'text', value: lot?.item?.name || '', label: 'Name', required: true },
            { id: 'description', type: 'text', value: lot?.item?.description || '', label: 'Description', required: true },
            { id: 'imgUrl', type: 'url', value: lot?.item?.imgUrl || '', label: 'Image URL', required: true },
            {
                id: 'domainId',
                type: 'select',
                value: lot?.item?.domainId || '',
                label: 'Domain',
                options: cats.domains.map(d => ({ value: d.id, label: d.name })),
                required: true
            },
            {
                id: 'licenseId',
                type: 'select',
                value: lot?.item?.licenseId || '',
                label: 'License',
                options: cats.licenses.map(l => ({ value: l.id, label: l.type })),
                required: true
            },
            {
                id: 'languageId',
                type: 'select',
                value: lot?.item?.languageId || '',
                label: 'Language',
                options: cats.languages.map(l => ({ value: l.id, label: l.name })),
                required: true
            },
            { id: 'start', type: 'datetime-local', value: lot?.start ? formatDateTimeLocal(lot.start) : '', label: 'Start Date', required: true },
            { id: 'end', type: 'datetime-local', value: lot?.end ? formatDateTimeLocal(lot.end) : '', label: 'End Date', required: true },
            { id: 'minBid', type: 'number', value: lot?.minBid || '', label: 'Min Bid', required: true }
        ];
    }

    /**
     * Collects and formats the payload for the lot submission.
     *
     * @param {Array<Object>} fields - The form fields.
     * @returns {Object} The formatted payload.
     */
    function collectPayload(fields) {
        return {
            item: {
                name: fields.find(f => f.id === 'name').value,
                description: fields.find(f => f.id === 'description').value,
                imgUrl: fields.find(f => f.id === 'imgUrl').value,
                domainId: Number(fields.find(f => f.id === 'domainId').value),
                licenseId: Number(fields.find(f => f.id === 'licenseId').value),
                languageId: Number(fields.find(f => f.id === 'languageId').value)
            },
            start: new Date(fields.find(f => f.id === 'start').value).toISOString(),
            end: new Date(fields.find(f => f.id === 'end').value).toISOString(),
            minBid: Number(fields.find(f => f.id === 'minBid').value)
        };
    }

    /**
     * Handles form submission, validates, and saves the lot.
     *
     * @async
     * @returns {Promise<void>}
     */
    async function handleSubmit() {
        errorMessage = '';
        const payload = collectPayload(fields);
        try {
            lotSchema.parse(payload);
            await onSave(payload, editingLot?.id || null);
            onClose();
        } catch (error) {
            if (error.name === 'ZodError') {
                errorMessage = error.issues.map(i => i.message).join(', ');
            }
        }
    }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
    <div class="relative w-full max-w-2xl h-full max-h-screen flex flex-col rounded-lg shadow-lg bg-white">
        <button
                class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                on:click={onClose}
        >
            &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Edit Lot</h2>

        <div class="flex-1 overflow-y-auto">
            <AuthForm
                    {fields}
                    onSubmit={handleSubmit}
                    buttonText="Save Changes"
                    errorMessage={errorMessage}
                    class="h-full w-full flex flex-col"
            />
        </div>
    </div>
</div>
