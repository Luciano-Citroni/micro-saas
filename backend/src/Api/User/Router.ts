import { Router } from 'express';
import { UsersController } from './Controller';

const controller = new UsersController();
const userRouter = Router();

userRouter.get('/get/all', controller.listUsersController);

userRouter.get('/get/:userId', controller.findOneUserByID);

userRouter.post('/create', controller.createUser);

export { userRouter };
