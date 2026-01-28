"use client"

import {
    User,
    ChessPawn,
    Package,
    Dice4,
    Boxes,
    LandPlot,
    BookUser,
    Waves,
    ChevronDown,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import Image from "next/image"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible"

// --------------------
// Menu definitions
// --------------------
const mainItems = [
    {
        title: "user-management",
        url: "/dashboard/users",
        icon: User,
    },
    {
        title: "packages",
        url: "/dashboard/packages",
        icon: Package,
    },
]

const baseInfoItems = [
    { title: "players", url: "/dashboard/players", icon: ChessPawn },
    { title: "settings", url: "/dashboard/settings", icon: Waves },
    { title: "seasons", url: "/dashboard/seasons", icon: Dice4 },
    { title: "clubs", url: "/dashboard/clubs", icon: Boxes },
    { title: "sports", url: "/dashboard/sports", icon: LandPlot },
    { title: "playerClubs", url: "/dashboard/player-clubs", icon: BookUser },
    { title: "teamLevels", url: "/dashboard/team-levels", icon: Waves },
    { title: "continents", url: "/dashboard/continents", icon: Waves },
    { title: "countries", url: "/dashboard/countries", icon: Waves },
    { title: "provinces", url: "/dashboard/provinces", icon: Waves },
    { title: "cities", url: "/dashboard/cities", icon: Waves },
    { title: "teams", url: "/dashboard/teams", icon: Waves },
    { title: "tournaments", url: "/dashboard/tournaments", icon: Waves },
    { title: "tournamentSeasons", url: "/dashboard/tournament-seasons", icon: Waves },
    { title: "teamSeasons", url: "/dashboard/team-seasons", icon: Waves },
    {
        title: "teamSeasonToTournamentSeasons",
        url: "/dashboard/team-season-to-tournament-seasons",
        icon: Waves,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const locale = useLocale()
    const t = useTranslations("SideBar")

    const isRtl = locale === "fa"

    // --------------------
    // آیا یکی از childها فعاله؟
    // --------------------
    const isBaseInfoActive = baseInfoItems.some(
        (item) => pathname === item.url
    )

    return (
        <Sidebar side={isRtl ? "right" : "left"}>
            <SidebarContent>
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Logo */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="rounded-none">
                                    <Link
                                        href="/"
                                        className="flex flex-col items-center justify-center h-[65px]"
                                    >
                                        <Image
                                            src="/images/logo-new.png"
                                            alt="logo"
                                            width={47}
                                            height={56}
                                        />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Main items */}
                            {mainItems.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="rounded-none">
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "flex flex-col items-center justify-center gap-2 px-3 py-2 h-[65px] transition-colors",
                                                    isActive
                                                        ? "bg-gray-700 text-white"
                                                        : "text-gray-700 hover:bg-gray-200"
                                                )}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span>{t(item.title)}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}

                            {/* Base Info (Collapsible) */}
                            <Collapsible
                                defaultOpen={isBaseInfoActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className={cn(
                                                "flex flex-col items-center justify-center gap-1 h-[65px] transition-colors",
                                                isBaseInfoActive
                                                    ? "bg-gray-700 text-white"
                                                    : "text-gray-700 hover:bg-gray-200"
                                            )}
                                        >
                                            <Waves className="w-4 h-4" />
                                            <span>{t("baseInfo")}</span>
                                            <ChevronDown
                                                className="
                                                    w-4 h-4 transition-transform
                                                    group-data-[state=open]/collapsible:rotate-180
                                                "
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {baseInfoItems.map((item) => {
                                                const isActive =
                                                    pathname === item.url
                                                return (
                                                    <SidebarMenuSubItem
                                                        key={item.title}
                                                    >
                                                        <SidebarMenuButton asChild>
                                                            <Link
                                                                href={item.url}
                                                                className={cn(
                                                                    "flex items-center gap-2 px-3 py-2 transition-colors",
                                                                    isActive
                                                                        ? "bg-gray-700 text-white"
                                                                        : "text-gray-700 hover:bg-gray-200"
                                                                )}
                                                            >
                                                                <item.icon className="w-4 h-4" />
                                                                <span>
                                                                    {t(
                                                                        item.title
                                                                    )}
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
