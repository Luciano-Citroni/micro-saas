import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { primsa } from '../database';

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    pages: {
        signIn: '/auth',
        signOut: '/auth',
        error: '/auth',
        verifyRequest: '/auth',
        newUser: '/app',
    },
    adapter: PrismaAdapter(primsa),
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
});
