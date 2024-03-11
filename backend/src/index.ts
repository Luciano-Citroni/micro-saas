import express from 'express';
import { userRouter } from './Api/User/Router';
import { todoRouter } from './Api/Todo/Router';
import { checkoutRouter } from './Api/Checkout/Router';
import { stripeRouter } from './Api/Stripe/Router';

const app = express();

app.use('/stripe', express.raw({ type: 'application/json' }), stripeRouter);

app.use(express.json());

app.use('/users', userRouter);

app.use('/todo', todoRouter);

app.use('/checkout', checkoutRouter);

app.listen(3000, () => {
    console.log('o backend está rodando na porta 3000');
});
