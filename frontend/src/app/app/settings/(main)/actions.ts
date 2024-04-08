'use server';

import { z } from 'zod';
import { updateProfileScheme } from './schemas';
import { auth } from '@/service/auth';
import { prisma } from '@/service/database';

export async function updateProfile(input: z.infer<typeof updateProfileScheme>) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: 'Not authorized',
            data: null,
        };
    }

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            name: input.name,
        },
    });
}
