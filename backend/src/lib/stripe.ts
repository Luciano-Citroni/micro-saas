import Stripe from 'stripe';
import { config } from '../utils/config';
import { prisma } from './prisma';

export const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

export const getStripeCustumerByEmail = async (email: string) => {
    const customer = await stripe.customers.list({ email });
    return customer.data[0];
};

export const createStripeCustomer = async (input: { email: string; name?: string }) => {
    let customer = await getStripeCustumerByEmail(input.email);

    if (customer) return customer;

    return await stripe.customers.create({
        email: input.email,
        name: input.name,
    });
};

export const createCheckoutSession = async (userID: string, userEmail: string) => {
    try {
        let customer = await createStripeCustomer({
            email: userEmail,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customer.id,
            line_items: [
                {
                    price: config.stripe.proPriceID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            client_reference_id: userID,
            success_url: 'http://localhost:3000/sucess.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });

        return {
            url: session.url,
        };
    } catch (err) {
        throw new Error('Error to create checkout session');
    }
};

export const handleProcessWebhookCheckout = async (event: { data: { object: Stripe.Checkout.Session } }) => {
    const clientRefecenceId = event.data.object.client_reference_id;
    const stripeSubscriptionId = event.data.object.subscription as string;
    const stripeCostomerId = event.data.object.customer as string;
    const checkoutStatus = event.data.object.status;

    if (checkoutStatus != 'complete') return;

    if (!clientRefecenceId || !stripeCostomerId || !stripeSubscriptionId) {
        throw new Error('clientRefecenceId, stripeSubscriptionId, stripeCostomerId is required');
    }

    const userExists = await prisma.user.findUnique({
        where: {
            id: clientRefecenceId,
        },
        select: {
            id: true,
        },
    });

    if (!userExists) {
        throw new Error('user of clientRefecenceId not found');
    }

    await prisma.user.update({
        where: {
            id: userExists.id,
        },
        data: {
            stripeCostomerId: stripeCostomerId,
            stripeSubscriptionId: stripeSubscriptionId,
            stripeSubscriptionStatus: checkoutStatus,
        },
    });
};

export const handleProcessWebhookUpdatedSubscription = async (event: { data: { object: Stripe.Subscription } }) => {
    const subscriptionStatus = event.data.object.status;
    const stripeCostomerId = event.data.object.customer as string;
    const stripeSubscriptionId = event.data.object.id as string;

    const userExists = await prisma.user.findFirst({
        where: {
            stripeCostomerId,
        },
        select: {
            id: true,
        },
    });

    if (!userExists) {
        throw new Error('user of clientRefecenceId not found');
    }

    await prisma.user.update({
        where: {
            id: userExists.id,
        },
        data: {
            stripeCostomerId,
            stripeSubscriptionId,
            stripeSubscriptionStatus: subscriptionStatus,
        },
    });
};
