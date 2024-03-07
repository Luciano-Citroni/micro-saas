import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export class UsersController {
    async listUsersController(request: Request, response: Response) {
        const users = await prisma.user.findMany();

        response.send(users);
    }

    async findOneUserByID(request: Request, response: Response) {
        const { userId } = request.params;

        const users = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!users) {
            return response.status(404).send({
                error: 'not found',
            });
        }

        response.send(users);
    }
}
