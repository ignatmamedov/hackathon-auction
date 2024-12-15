<script>
    import { login } from '../utils/auth';
    import page from 'page';
    import { z } from 'zod';

    let email = '';
    let password = '';
    let errorMessage = '';

    const loginSchema = z.object({
        email: z.string().email({ message: 'Invalid email format' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    });

    const handleLogin = async () => {
        errorMessage = '';

        try {
            const validatedData = loginSchema.parse({ email, password });

            const response = await fetch(`http://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/api/auth/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

<main>
    <h1>Login</h1>

    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
        <label for="email">Email</label>
        <input
                id="email"
                type="email"
                bind:value={email}
                placeholder="Enter your email"
                required
        />

        <label for="password">Password</label>
        <input
                id="password"
                type="password"
                bind:value={password}
                placeholder="Enter your password"
                required
        />

        <button type="submit">Login</button>
    </form>

    <p>Don't have an account? <a href="/sign-up">Sign Up</a></p>
</main>
