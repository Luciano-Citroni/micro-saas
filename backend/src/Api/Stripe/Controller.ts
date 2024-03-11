import { Request, Response } from 'express';

import { config } from '../../utils/config';
import { handleProcessWebhookCheckout, handleProcessWebhookUpdatedSubscription, stripe } from '../../lib/stripe';
import Stripe from 'stripe';

export class StripeController {
    async stripeWebhook(request: Request, response: Response) {
        let event = request.body;

        if (!config.stripe.webhook_secret) {
            return response.sendStatus(400);
        }

        const signature = request.headers['stripe-signature'] as string;

        try {
            event = await stripe.webhooks.constructEventAsync(
                request.body,
                signature,
                config.stripe.webhook_secret,
                undefined,
                Stripe.createSubtleCryptoProvider()
            );
        } catch (err) {
            console.log(err);
            return response.status(400).send({
                error: 'webhook signature verification failed',
            });
        }

        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    await handleProcessWebhookCheckout(event);
                case 'checkout.subscription.created':
                case 'checkout.subscription.updated':
                    await handleProcessWebhookUpdatedSubscription(event);
                default:
                    console.log('Unhandle event type: ', event.type);
            }

            return response.json({ received: true });
        } catch (err) {
            console.log(err);
            return response.status(400).send({
                error: 'webhook signature verification failed',
            });
        }
    }
}
