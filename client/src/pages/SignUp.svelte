<script>
    import AuthForm from '../components/AuthForm.svelte';
    import { registrationSchema } from '../utils/validation.js';
    import { register } from '../utils/auth';
    import page from 'page';

    let fields = [
        { id: 'email', type: 'email', value: '', label: 'E-mail Address', placeholder: 'Enter your e-mail', required: true },
        { id: 'password', type: 'password', value: '', label: 'Password', placeholder: 'Enter your password', required: true },
        { id: 'passwordRepeat', type: 'password', value: '', label: 'Password Repeat', placeholder: 'Repeat your password', required: true }
    ];

    let errorMessage = '';

    const handleSignUp = async () => {
        errorMessage = '';

        const email = fields[0].value;
        const password = fields[1].value;
        const passwordRepeat = fields[2].value;

        try {
            const validatedData = registrationSchema.parse({email, password, passwordRepeat});

            await register(validatedData.email, validatedData.password);
            page('/');
        } catch (error) {
            if (error.errors) {
                errorMessage = error.errors.map(err => err.message).join(', ');
            } else {
                errorMessage = error.message;
            }
        }
    };
</script>

<AuthForm
        bind:fields
        onSubmit={handleSignUp}
        buttonText="Sign Up"
        errorMessage={errorMessage}
/>