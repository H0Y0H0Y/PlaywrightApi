import { z } from 'zod';

export const createUserSchema = z.object({
    code: z.number(),
    type: z.string(),
    message: z.string()
});