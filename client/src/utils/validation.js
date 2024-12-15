import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export const registrationSchema = z
    .object({
        email: z.string().email({ message: 'Invalid email format' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        passwordRepeat: z.string()
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: 'Passwords do not match',
        path: ['passwordRepeat']
    });