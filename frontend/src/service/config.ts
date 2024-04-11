export const config = {
    stripe: {
        publishedKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISEDKEY as string,
        secretKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string,
        webhook_secret: process.env.STRIPE_WEBHOOKSECRET as string,
        plans: {
            free: {
                priceId: 'price_1P4T2vLVx0xg3ul0IdCGfXPT',
                quota: {
                    TASKS: 5,
                },
            },
            pro: {
                priceId: 'price_1P4T39LVx0xg3ul0q5MIuGjG',
                quota: {
                    TASKS: 100,
                },
            },
        },
    },
};
