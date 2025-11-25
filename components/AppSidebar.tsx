'use client'
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { cn } from "@/lib/utils"


import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function AppSidebar() {
    const pathname = usePathname()
    const t = useTranslations();
    const params = useParams();
    const locale = params.locale as string;

    // Menu items.
    const items = [
        {
            key: "sidebar.home",
            url: `/${locale}`,
            icon: Home,
        },
        {
            key: "sidebar.inbox",
            url: `/${locale}/inbox`,
            icon: Inbox,
        },
        {
            key: "sidebar.calendar",
            url: `/${locale}/calendar`,
            icon: Calendar,
        },
        {
            key: "sidebar.search",
            url: `/${locale}/search`,
            icon: Search,
        },
        {
            key: "sidebar.settings",
            url: `/${locale}/settings`,
            icon: Settings,
        },
    ]

    return (
        <Sidebar side='right'>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t('sidebar.brand')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.key}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded transition-colors",
                                                    isActive ? "bg-gray-700 text-white" : "text-gray-700 hover:bg-gray-200"
                                                )}
                                            >
                                                <item.icon />
                                                <span>{t(item.key)}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}