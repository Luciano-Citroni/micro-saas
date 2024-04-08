'use client';
import { SidebarNav, SidebarNavLink, SidebarNavMain } from '@/components/dashboard/sidebar';
import { usePathname } from 'next/navigation';

export function SettingsSidebar() {
    const pathname = usePathname();

    function isActive(path: string) {
        return pathname === path;
    }

    return (
        <aside>
            <SidebarNav>
                <SidebarNavMain>
                    <SidebarNavLink href="/app/settings" active={isActive('/app/settings')}>
                        My profile
                    </SidebarNavLink>
                    <SidebarNavLink href="/app/settings/theme" active={isActive('/app/settings/theme')}>
                        Theme
                    </SidebarNavLink>
                    <SidebarNavLink href="/app/settings/billing" active={isActive('/app/settings/billing')}>
                        Billing
                    </SidebarNavLink>
                </SidebarNavMain>
            </SidebarNav>
        </aside>
    );
}
