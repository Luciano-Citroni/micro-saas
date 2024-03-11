import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createStripeCustomer } from '../../lib/stripe';

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

    async createUser(request: Request, response: Response) {
        const { name, email } = request.body;

        if (!name || !email) {
            return response.status(400).send({
                error: 'Name or Email is invalid',
            });
        }

        const usersEmailAlreadyExists = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
            },
        });

        if (usersEmailAlreadyExists) {
            return response.status(400).send({
                error: 'Email already in use',
            });
        }

        const customer = await createStripeCustomer({ email: email, name: name });

        const user = await prisma.user.create({
            data: {
                name,
                email,
                stripeCostomerId: customer.id,
            },
        });

        response.send(user);
    }
}
