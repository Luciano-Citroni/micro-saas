import { Router } from 'express';
import { Checkout } from './Controller';

const controller = new Checkout();
const checkoutRouter = Router();

checkoutRouter.post('/create', controller.create);

export { checkoutRouter };
