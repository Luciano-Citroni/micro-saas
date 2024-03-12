export const config = {
    stripe: {
        publishedKey: process.env.STIPE_PUBLISEDKEY as string,
        secretKey: process.env.STIPE_SECRETKEY as string,
        proPriceID: process.env.STIPE_PRICEPROID as string,
        webhook_secret: process.env.STIPE_WEBHOOKSECRET as string,
    },
};
