import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createCheckoutSessionAction } from './actions';
import { auth } from '@/service/auth';
import { getPlanByPrice, getUserCurrentPlan } from '@/service/stripe';

export default async function BillingPage() {
    const session = await auth();
    const plan = await getUserCurrentPlan(session?.user.id as string);

    return (
        <form action={createCheckoutSessionAction}>
            <Card>
                <CardHeader className="border-b border-border">
                    <CardTitle>Plano Usado</CardTitle>
                    <CardDescription>
                        Você está utilizando o plano <span className="font-bold uppercase">{plan.name}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <header className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">
                                {plan.quota.TASKS.current}/{plan.quota.TASKS.available}
                            </span>
                            <span className="text-muted-foreground text-sm">{plan.quota.TASKS.usage}%</span>
                        </header>
                        <main>
                            <Progress value={plan.quota.TASKS.usage} />
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
