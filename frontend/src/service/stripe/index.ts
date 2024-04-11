import Stripe from 'stripe';
import { config } from '../config';
import { prisma } from '../database';

export const stripe = new Stripe(config.stripe.secretKey || '', {
    apiVersion: '2024-04-10',
    httpClient: Stripe.createFetchHttpClient(),
});

export const getStripeCustumerByEmail = async (email: string) => {
    const customer = await stripe.customers.list({ email });
    return customer.data[0];
};

export const createStripeCustomer = async (input: { email: string; name?: string }) => {
    let customer = await getStripeCustumerByEmail(input.email);

    if (customer) return customer;

    const createdCostumer = await stripe.customers.create({
        email: input.email,
        name: input.name,
    });

    const createdCostumerSubscription = await stripe.subscriptions.create({
        customer: createdCostumer.id,
        items: [{ price: config.stripe.plans.free.priceId }],
    });

    await prisma.user.update({
        where: {
            email: input.email,
        },
        data: {
            stripeCostomerId: createdCostumer.id,
            stripeSubscriptionId: createdCostumerSubscription.id,
            stripeSubscriptionStatus: createdCostumerSubscription.status,
            stripePriceId: config.stripe.plans.free.priceId,
        },
    });

    return createdCostumer;
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
                    price: config.stripe.plans.pro.priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            client_reference_id: userID,
            success_url: 'http://localhost:3000/app/settings/billing?sucess=true',
            cancel_url: 'http://localhost:3000/app/settings/billing?sucess=true',
        });

        return {
            url: session.url,
        };
    } catch (err) {
        console.log(err);

        throw new Error('Error to create checkout session');
    }
};
