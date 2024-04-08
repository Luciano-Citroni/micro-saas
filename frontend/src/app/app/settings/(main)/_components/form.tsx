'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateProfile } from '../actions';
import { updateProfileScheme } from '../schemas';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Session } from 'next-auth';
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';

type ProfileFormProps = {
    defaultValue: Session['user'];
};

export function ProfileForm({ defaultValue }: ProfileFormProps) {
    const router = useRouter();

    const form = useForm<z.infer<typeof updateProfileScheme>>({
        resolver: zodResolver(updateProfileScheme),
        defaultValues: {
            email: defaultValue?.email ?? '',
            name: defaultValue?.name ?? '',
        },
    });

    const onSubmit = form.handleSubmit(async (data) => {
        await updateProfile(data);
        router.refresh();

        toast({
            title: 'Success',
            description: 'Seu perfil foi atualizado com sucesso!.',
        });
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8 ">
                <Card>
                    <CardHeader>
                        <CardTitle>Nome</CardTitle>
                        <CardDescription>Coloque seu nome aqui</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Coloque seu nome" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Email</CardTitle>
                        <CardDescription>Caso queira mudar o email, entre em contato por: contact@micro-saas.com</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Coloque seu email" {...field} readOnly />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <SheetFooter className="mt-auto">
                    <Button disabled={form.formState.isLoading} type="submit">
                        {form.formState.isSubmitting && 'Salvando....'}
                        {!form.formState.isSubmitting && 'Salvar'}
                    </Button>
                </SheetFooter>
            </form>
        </Form>
    );
}
