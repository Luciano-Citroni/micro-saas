import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export class Todo {
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
            select: {
                id: true,
                stripeSubscriptionId: true,
                stripeSubscriptionStatus: true,
                _count: {
                    select: {
                        todos: true,
                    },
                },
            },
        });

        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            });
        }

        const hasQuotaAvaible = user._count.todos + 1 <= 5;
        const hasActiveSubscription = !!user.stripeSubscriptionId && user.stripeSubscriptionStatus != 'active';

        if (!hasQuotaAvaible && !hasActiveSubscription) {
            return response.status(403).send({
                error: 'not quota avaible. Please upgrade your plan',
            });
        }

        const { title } = request.body;

        const todo = await prisma.todo.create({
            data: {
                title: title,
                ownerID: user.id,
            },
        });

        return response.send(todo);
    }
}
