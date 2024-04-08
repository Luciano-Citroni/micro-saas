import { z } from 'zod';

export const updateProfileScheme = z.object({
    email: z.string().email(),
    name: z.string(),
});
