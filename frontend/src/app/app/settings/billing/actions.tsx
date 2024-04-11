'use server';

import { auth } from '@/service/auth';
import { createCheckoutSession } from '@/service/stripe';
import { redirect } from 'next/navigation';

export async function createCheckoutSessionAction() {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: 'Not authorized',
            data: null,
        };
    }

    const sessionCheckout = await createCheckoutSession(session.user.id, session.user.email as string);

    if (!sessionCheckout.url) return;

    redirect(sessionCheckout.url);
}
