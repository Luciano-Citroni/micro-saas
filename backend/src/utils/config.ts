export const config = {
    stripe: {
        publishedKey: process.env.STIPE_PUBLISEDKEY,
        secretKey: process.env.STIPE_SECRETKEY,
        proPriceID: process.env.STIPE_PRICEPROID,
        webhook_secret: process.env.STIPE_WEBHOOKSECRET,
    },
};
