import { Router } from 'express';
import { Todo } from './Controller';

const controller = new Todo();
const todoRouter = Router();

todoRouter.post('/create', controller.create);

export { todoRouter };
