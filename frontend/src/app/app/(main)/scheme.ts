import { z } from 'zod';

export const upsertTodoScheme = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    doneAt: z.date().optional(),
});

export const deleteTodoScheme = z.object({
    id: z.string(),
});
