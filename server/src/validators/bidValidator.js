import { z } from 'zod';

export const bidSchema = z.object({
    lotId: z.string().nonempty('lotId is required'),
    amount: z.number().positive('Amount must be a positive number')
});
