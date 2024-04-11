import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createCheckoutSessionAction } from './actions';

export default function BillingPage() {
    return (
        <form action={createCheckoutSessionAction}>
            <Card>
                <CardHeader className="border-b border-border">
                    <CardTitle>Plano Usado</CardTitle>
                    <CardDescription>Você está utilizando o [current_plan]. O proximo pagamento é [next_due_date] </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <header className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">1/5</span>
                            <span className="text-muted-foreground text-sm">20%</span>
                        </header>
                        <main>
                            <Progress value={20} />
                        </main>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-6">
                    <span>Para um maior limite, assine o PRO</span>
                    <Button type="submit">Assine por R$9/ mês</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
