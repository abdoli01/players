'use client'
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils" // فرض بر اینه که cn رو دارید
import { useLocale } from 'next-intl';

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

// Menu items.
const items = [
    {
        title: "خانه",
        url: "/",
        icon: Home,
    },
    {
        title: "نامه ها",
        url: "/inbox",
        icon: Inbox,
    },
    {
        title: "تقویم",
        url: "/calendar",
        icon: Calendar,
    },
    {
        title: "جست و جو",
        url: "/search",
        icon: Search,
    },
    {
        title: "تنظیمات",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const locale = useLocale();

    return (
        <Sidebar side={`${(locale && locale === 'fa') ? 'right' : (locale && locale === 'en') ? 'left' : 'right'}`}>
        <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Metrica</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 rounded transition-colors",
                                                    isActive ? "bg-gray-700 text-white" : "text-gray-700 hover:bg-gray-200"
                                                )}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
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