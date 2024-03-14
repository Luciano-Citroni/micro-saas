'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

export default function AuthForm() {
    const form = useForm();

    const handleSubmit = form.handleSubmit(async (data) => {
        try {
            await signIn('nodemailer', { email: data.email, redirect: false });
            toast({
                title: 'Magic Link Enviado!',
                description: 'Verifique seu email para acessar com o magic link',
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Algum erro aconteceu, tente novamente',
            });
        }
    });

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email below to receive a magic link to login to your account</p>
            </div>
            <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="m@example.com" type="email" {...form.register('email')} />
                </div>
                <Button className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Sending......' : 'Send Magic Link'}
                </Button>
            </form>
        </div>
    );
}
