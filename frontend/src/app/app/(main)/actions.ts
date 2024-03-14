'use server';

import { auth } from '@/service/auth';
import { prisma } from '@/service/database';
import { z } from 'zod';
import { deleteTodoScheme, upsertTodoScheme } from './scheme';

export async function getUserTodos() {
    const session = await auth();
    const todos = await prisma.todo.findMany({
        where: {
            userId: session?.user?.id,
        },
        orderBy: {
            createAt: 'desc',
        },
    });

    return todos;
}

export async function upsertTodo(input: z.infer<typeof upsertTodoScheme>) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: 'Not authorized',
            data: null,
        };
    }

    if (input.id) {
        const todo = await prisma.todo.findUnique({
            where: {
                id: input.id,
                userId: session?.user?.id,
            },
            select: {
                id: true,
            },
        });

        if (!todo) return { error: 'Todo not found', data: null };

        const updateTodo = await prisma.todo.update({
            where: {
                id: input.id,
                userId: session?.user?.id,
            },
            data: {
                title: input.title,
                doneAt: input.doneAt,
            },
        });

        return {
            error: null,
            data: updateTodo,
        };
    }

    if (!input.title) {
        return {
            error: 'Title is required',
            data: null,
        };
    }

    const todo = await prisma.todo.create({
        data: {
            userId: session?.user?.id,
            title: input.title,
        },
    });

    return todo;
}

export async function deleteTodo(input: z.infer<typeof deleteTodoScheme>) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: 'Not authorized',
            data: null,
        };
    }

    const todo = await prisma.todo.findUnique({
        where: {
            id: input.id,
            userId: session?.user?.id,
        },
        select: {
            id: true,
        },
    });

    if (!todo) return { error: 'Todo not found', data: null };

    await prisma.todo.delete({
        where: {
            id: input.id,
        },
    });

    return {
        error: null,
        data: 'Todo deleted successfully',
    };
}
