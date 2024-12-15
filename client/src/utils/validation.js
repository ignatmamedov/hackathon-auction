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

export const lotSchema = z.object({
    item: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        imgUrl: z.string().url('Invalid image URL'),
        domainId: z.number().int(),
        licenseId: z.number().int(),
        languageId: z.number().int()
    }),
    start: z.string().datetime({message: 'Invalid start date-time format'}),
    end: z.string().datetime({message: 'Invalid end date-time format'}),
    minBid: z.number().min(0, 'Minimum bid must be at least 0')
});
