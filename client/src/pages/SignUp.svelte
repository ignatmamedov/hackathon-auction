<script>
    import { register } from '../utils/auth';
    import page from 'page';
    import { z } from 'zod';

    let email = '';
    let password = '';
    let passwordRepeat = '';
    let errorMessage = '';

    const registrationSchema = z
        .object({
            email: z.string().email({ message: 'Invalid email format' }),
            password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
            passwordRepeat: z.string()
        })
        .refine((data) => data.password === data.passwordRepeat, {
            message: 'Passwords do not match',
            path: ['passwordRepeat']
        });

    const handleSignUp = async () => {
        errorMessage = '';

        try {
            const validatedData = registrationSchema.parse({
                email,
                password,
                passwordRepeat
            });

            await register(validatedData.email, validatedData.password);
            page('/');
        } catch (error) {
            if (error.errors) {
                errorMessage = error.errors.map((err) => err.message).join(', ');
            } else {
                errorMessage = error.message;
            }
        }
    };
</script>

<main>
    <header>
        <h1>Sign Up</h1>
    </header>

    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}

    <form on:submit|preventDefault={handleSignUp}>
        <label for="email">E-mail Address</label>
        <input
                id="email"
                type="email"
                bind:value={email}
                placeholder="Enter your e-mail"
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

        <label for="passwordRepeat">Password Repeat</label>
        <input
                id="passwordRepeat"
                type="password"
                bind:value={passwordRepeat}
                placeholder="Repeat your password"
                required
        />

        <button type="submit">Sign Up</button>
    </form>

    <p>Already have an account? <a href="/login">Login</a></p>
</main>
