'use client'
import { User,ChessPawn,Package,Dice4,Boxes,LandPlot,BookUser,Waves } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
} from "@/components/ui/sidebar"
import Link from "next/link";
import Image from "next/image";

// Menu items.
const items = [
    {
        title: "user-management",
        url: "/dashboard/users",
        icon: User,
    },
    {
        title: "players",
        url: "/dashboard/players",
        icon: ChessPawn,
    },
    {
        title: "packages",
        url: "/dashboard/packages",
        icon: Package,
    },
    {
        title: "seasons",
        url: "/dashboard/seasons",
        icon: Dice4,
    },
    {
        title: "clubs",
        url: "/dashboard/clubs",
        icon: Boxes,
    },
    {
        title: "sports",
        url: "/dashboard/sports",
        icon: LandPlot,
    },
    {
        title: "playerClubs",
        url: "/dashboard/player-clubs",
        icon: BookUser,
    },
    {
        title: "teamLevels",
        url: "/dashboard/team-levels",
        icon: Waves,
    },
    {
        title: "continents",
        url: "/dashboard/continents",
        icon: Waves,
    },
    {
        title: "countries",
        url: "/dashboard/countries",
        icon: Waves,
    },
    {
        title: "provinces",
        url: "/dashboard/provinces",
        icon: Waves,
    },
    {
        title: "cities",
        url: "/dashboard/cities",
        icon: Waves,
    }
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const locale = useLocale();
    const t = useTranslations('SideBar');
    return (
        <Sidebar side={`${(locale && locale === 'fa') ? 'right' : (locale && locale === 'en') ? 'left' : 'right'}`}>
            <SidebarContent>
                <SidebarGroup className='p-0'>
                    <SidebarGroupContent>
                        <SidebarMenu>
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
                                const isActive = pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="rounded-[0px]">
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "flex flex-col items-center justify-center gap-2 px-3 py-2 transition-colors h-[65px]",
                                                    isActive ? "bg-gray-700 text-white" : "text-gray-700 hover:bg-gray-200"
                                                )}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span>{t(`${item.title}`)}</span>
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