import { auth } from '@/service/auth';
import { ProfileForm } from './_components/form';

export default async function SettingsPage() {
    const session = await auth();

    return (
        <div>
            <ProfileForm defaultValue={session?.user} />
        </div>
    );
}
