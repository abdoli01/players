'use client'
import { Home,Scissors } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils" // فرض بر اینه که cn رو دارید
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
} from "@/components/ui/sidebar"
import Link from "next/link";
import Image from "next/image";
import {SidebarProfile} from "@/components/SidebarProfile";

// Menu items.
const items = [
    {
        title: "home",
        url: "/",
        icon: Home,
    },
    {
        title: "studio",
        url: "/studio",
        icon: Scissors,
    },
    // {
    //     title: "calendar",
    //     url: "/calendar",
    //     icon: Calendar,
    // },
    // {
    //     title: "search",
    //     url: "/search",
    //     icon: Search,
    // },
    // {
    //     title: "settings",
    //     url: "/settings",
    //     icon: Settings,
    // },
]

export function AppSidebar() {
    const pathname = usePathname()
    const locale = useLocale();
    const t = useTranslations('SideBar');
    return (
        <Sidebar side={`${(locale && locale === 'fa') ? 'right' : (locale && locale === 'en') ? 'left' : 'right'}`}>
        <SidebarContent>
                <SidebarGroup className='p-0'>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-0'>
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild className="rounded-[0px]">
                                    <Link
                                        href='/'
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 px-3 py-2 transition-colors h-[65px]",
                                        )}
                                    >
                                        <Image src="/images/logo-new.png" alt="logo"  width={47} height={56}/>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {items.map((item) => {
                                const isActive = item.title === "home"
                                    ? ["/", "/videos", "/profile" , "/reports"].includes(pathname)
                                    : pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <Link
                                            href={item.url}
                                            className={cn(
                                                "flex flex-col items-center justify-center gap-2 px-3 py-2 transition-colors h-[65px] text-foreground rounded-[0px]",
                                                isActive ? "bg-app-orange" : "hover:bg-app-orange"
                                            )}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span>{t(`${item.title}`)}</span>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='p-0'>
                <SidebarProfile/>
            </SidebarFooter>
        </Sidebar>
    )
}