import { auth } from '@/service/auth';

import { DashboardPage, DashboardPageHeader, DashboardPageHeaderTitle, DashboardPageMain } from '@/components/dashboard/page';

export default async function AppPage() {
    const session = await auth();
    return (
        <DashboardPage>
            <DashboardPageHeader>
                <DashboardPageHeaderTitle>Tarefas</DashboardPageHeaderTitle>
            </DashboardPageHeader>
            <DashboardPageMain>
                <h1>terfas</h1>
            </DashboardPageMain>
        </DashboardPage>
    );
}
