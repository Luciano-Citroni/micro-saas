'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Todo } from '../types';
import { useRef } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { upsertTodo } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { upsertTodoScheme } from '../scheme';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

type TodoUpsertSheetProps = {
    children?: React.ReactNode;
    defaultValue?: Todo;
};

export function TodoUpsertSheet({ children }: TodoUpsertSheetProps) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(upsertTodoScheme),
    });

    const onSubmit = form.handleSubmit(async (data) => {
        await upsertTodo(data);
        router.refresh();

        ref.current?.click();

        toast({
            title: 'Cadastrado com sucesso',
            description: 'A tarefa foi cadastrada com sucesso!',
        });
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div ref={ref}>{children}</div>
            </SheetTrigger>
            <SheetContent>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-8 h-screen ">
                        <SheetHeader>
                            <SheetTitle>Cadastrar Tarefa</SheetTitle>

                            <SheetDescription>Adicione ou edite um item de tarefa aqui. Clique em salvar quando terminar.</SheetDescription>
                        </SheetHeader>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titulo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your todo title" {...field} />
                                    </FormControl>
                                    <FormDescription>Este será o nome da sua tarefa.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SheetFooter className="mt-auto">
                            <Button type="submit">Salvar</Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
