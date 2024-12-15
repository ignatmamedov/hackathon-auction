<script>
    import AuthForm from '../components/AuthForm.svelte';
    import {lotSchema} from '../utils/validation.js';
    import Button from '../components/Button.svelte';

    export let editingLot = null;
    export let categories;
    export let onClose;
    export let onSave;

    function formatDateTimeLocal(date) {
        return new Date(date).toISOString().slice(0, 16);
    }

    let fields = [];
    let errorMessage = '';

    $: fields = (editingLot !== null && categories)
        ? prepareFields(editingLot, categories)
        : fields;

    function prepareFields(lot, cats) {
        if (!lot || !lot.item) {
            return [
                {id: 'name', type: 'text', value: '', label: 'Name', required: true},
                {id: 'description', type: 'text', value: '', label: 'Description', required: true},
                {id: 'imgUrl', type: 'url', value: '', label: 'Image URL', required: true},
                {
                    id: 'domainId',
                    type: 'select',
                    value: '',
                    label: 'Domain',
                    options: cats.domains.map(d => ({value: d.id, label: d.name})),
                    required: true
                },
                {
                    id: 'licenseId',
                    type: 'select',
                    value: '',
                    label: 'License',
                    options: cats.licenses.map(l => ({value: l.id, label: l.type})),
                    required: true
                },
                {
                    id: 'languageId',
                    type: 'select',
                    value: '',
                    label: 'Language',
                    options: cats.languages.map(l => ({value: l.id, label: l.name})),
                    required: true
                },
                {id: 'start', type: 'datetime-local', value: '', label: 'Start Date', required: true},
                {id: 'end', type: 'datetime-local', value: '', label: 'End Date', required: true},
                {id: 'minBid', type: 'number', value: '', label: 'Min Bid', required: true}
            ];
        }

        return [
            {id: 'name', type: 'text', value: lot.item.name, label: 'Name', required: true},
            {id: 'description', type: 'text', value: lot.item.description, label: 'Description', required: true},
            {id: 'imgUrl', type: 'url', value: lot.item.imgUrl, label: 'Image URL', required: true},
            {
                id: 'domainId',
                type: 'select',
                value: lot.item.domainId,
                label: 'Domain',
                options: cats.domains.map(d => ({value: d.id, label: d.name})),
                required: true
            },
            {
                id: 'licenseId',
                type: 'select',
                value: lot.item.licenseId,
                label: 'License',
                options: cats.licenses.map(l => ({value: l.id, label: l.type})),
                required: true
            },
            {
                id: 'languageId',
                type: 'select',
                value: lot.item.languageId,
                label: 'Language',
                options: cats.languages.map(l => ({value: l.id, label: l.name})),
                required: true
            },
            {
                id: 'start',
                type: 'datetime-local',
                value: formatDateTimeLocal(lot.start),
                label: 'Start Date',
                required: true
            },
            {id: 'end', type: 'datetime-local', value: formatDateTimeLocal(lot.end), label: 'End Date', required: true},
            {id: 'minBid', type: 'number', value: lot.minBid, label: 'Min Bid', required: true}
        ];
    }

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

    async function handleSubmit() {
        errorMessage = '';
        const payload = collectPayload(fields);
        try {
            lotSchema.parse(payload);
            await onSave(payload, editingLot && editingLot.id ? editingLot.id : null);
            onClose();
        } catch (error) {
            if (error.name === 'ZodError') {
                const errs = Object.values(error.issues).map(i => i.message);
                errorMessage = errs.join(', ');
            }
        }
    }
</script>

<div class="modal">
    <div class="modal-content">
        <Button text="X" onClick={onClose}/>
        <AuthForm
                {fields}
                onSubmit={handleSubmit}
                buttonText="Save Changes"
                errorMessage={errorMessage}
        />
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: #fff;
        padding: 2rem;
        border-radius: 8px;
        width: 100%;
        max-width: 600px;
        position: relative;
    }
</style>
