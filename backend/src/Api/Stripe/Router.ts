import { Router } from 'express';
import { StripeController } from './Controller';

const controller = new StripeController();
const stripeRouter = Router();

stripeRouter.post('/', controller.stripeWebhook);

export { stripeRouter };
