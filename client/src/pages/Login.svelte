<script>
    import AuthForm from '../components/AuthForm.svelte';
    import { loginSchema } from '../utils/validation.js';
    import { login } from '../utils/auth';
    import page from 'page';

    let fields = [
        { id: 'email', type: 'email', value: '', label: 'Email', placeholder: 'Enter your email', required: true },
        { id: 'password', type: 'password', value: '', label: 'Password', placeholder: 'Enter your password', required: true }
    ];

    let errorMessage = '';

    const handleLogin = async () => {
        errorMessage = '';

        const email = fields[0].value;
        const password = fields[1].value;

        try {
            const validatedData = loginSchema.parse({email, password});
            const response = await fetch(`http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/api/auth/tokens`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error?.message || 'Login failed');
            }

            login(result.token);
            page('/');
        } catch (error) {
            errorMessage = error.errors ? error.errors.map(err => err.message).join(', ') : error.message;
        }
    };
</script>

<AuthForm
        bind:fields
        onSubmit={handleLogin}
        buttonText="Login"
        errorMessage={errorMessage}
/>
