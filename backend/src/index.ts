import express from 'express';
import { userRouter } from './Api/User/Router';

const app = express();

app.use('/users', userRouter);

app.listen(3000, () => {
    console.log('o backend está rodando na porta 3000');
});
