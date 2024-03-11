import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { createCheckoutSession } from '../../lib/stripe';

export class Checkout {
    async create(request: Request, response: Response) {
        const userID = request.headers['x-user-id'];

        if (!userID) {
            return response.status(403).send({
                error: 'Not authorized',
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userID as string,
            },
        });

        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            });
        }

        const checkout = await createCheckoutSession(user.id, user.email);

        response.send(checkout);
    }
}
