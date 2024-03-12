'use client';

import {
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarMain,
    SidebarNav,
    SidebarNavHeader,
    SidebarNavHeaderTitle,
    SidebarNavLink,
} from '@/components/dashboard/sidebar';
import { HomeIcon, MixerVerticalIcon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';
import { UserDropdown } from './user-dropdown';
import { Logo } from '@/components/logo';
import { Session } from 'next-auth';

type MainSidebarProps = {
    user: Session['user'];
};

export function MainSidebar({ user }: MainSidebarProps) {
    const pathname = usePathname();

    function isActive(path: string) {
        return pathname === path;
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarMain className="flex flex-col flex-grow">
                <SidebarNav>
                    <SidebarMain>
                        <SidebarNavLink active={isActive('/app')} href="/app">
                            <HomeIcon className="w-4 h-4 mr-3" />
                            Tarefas
                        </SidebarNavLink>
                        <SidebarNavLink active={isActive('/app/settings')} href="/app/settings">
                            <MixerVerticalIcon className="w-4 h-4 mr-3" />
                            Configurações
                        </SidebarNavLink>
                    </SidebarMain>
                </SidebarNav>

                <SidebarNav className="mt-auto">
                    <SidebarNavHeaderTitle>
                        <SidebarNavHeaderTitle>Links extras</SidebarNavHeaderTitle>
                    </SidebarNavHeaderTitle>
                    <SidebarMain>
                        <SidebarNavLink href="/">Precisa de ajuda?</SidebarNavLink>
                        <SidebarNavLink href="/">Site</SidebarNavLink>
                    </SidebarMain>
                </SidebarNav>
            </SidebarMain>
            <SidebarFooter>
                <UserDropdown user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
