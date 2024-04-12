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

export const createCheckoutSession = async (userID: string, userEmail: string, userStripeSubscriptionId: string) => {
    try {
        let customer = await createStripeCustomer({
            email: userEmail,
        });

        const subscription = await stripe.subscriptionItems.list({
            subscription: userStripeSubscriptionId,
            limit: 1,
        });

        const session = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: 'http://localhost:3000/app/settings/billing',
            flow_data: {
                type: 'subscription_update_confirm',
                after_completion: {
                    type: 'redirect',
                    redirect: {
                        return_url: 'http://localhost:3000/app/settings/billing?sucess=true',
                    },
                },
                subscription_update_confirm: {
                    subscription: userStripeSubscriptionId,
                    items: [
                        {
                            id: subscription.data[0].id,
                            price: config.stripe.plans.pro.priceId,
                            quantity: 1,
                        },
                    ],
                },
            },
        });

        return {
            url: session.url,
        };
    } catch (err) {
        console.log(err);

        throw new Error('Error to create checkout session');
    }
};

export const handleProcessWebhookUpdatedSubscription = async (event: { object: Stripe.Subscription }) => {
    const subscriptionStatus = event.object.status;
    const stripeCostomerId = event.object.customer as string;
    const stripeSubscriptionId = event.object.id as string;
    const stripePriceId = event.object.items.data[0].price.id;

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
            stripePriceId: stripePriceId,
        },
    });
};

type Plan = {
    priceId: string;
    quota: {
        TASKS: number;
    };
};

type Plans = {
    [key: string]: Plan;
};

export const getPlanByPrice = (priceId: string) => {
    const plans: Plans = config.stripe.plans;

    const planKey = Object.keys(plans).find((key) => plans[key].priceId === priceId) as keyof Plans | undefined;

    const plan = planKey ? plans[planKey] : null;

    if (!plan) throw new Error(`Plan not found for priceId: ${priceId}`);

    return {
        name: planKey,
        quota: plan.quota,
    };
};

export const getUserCurrentPlan = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            stripePriceId: true,
        },
    });

    if (!user || !user.stripePriceId) {
        throw new Error('User or user stripePriceId not found');
    }

    const plan = getPlanByPrice(user.stripePriceId);

    const tasksCount = await prisma.todo.count({
        where: {
            userId,
        },
    });

    const availableTasks = plan.quota.TASKS;
    const currentTasks = tasksCount;
    const usage = (currentTasks / availableTasks) * 100;

    return {
        name: plan.name,
        quota: {
            TASKS: {
                available: availableTasks,
                current: currentTasks,
                usage,
            },
        },
    };
};
