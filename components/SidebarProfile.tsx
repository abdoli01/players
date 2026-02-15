"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
    User,
    Globe,
    Palette,
    Settings,
    LayoutDashboard,
    LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ModeToggle } from "@/components/Theme";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {useAppSelector} from "@/store/hooks";

export function SidebarProfile() {
    const logout = useLogout();
    const [open, setOpen] = useState(false);
    const t = useTranslations('SideBar');
    const locale = useLocale();
    const user = useAppSelector((s) => s.user.user);

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 px-3 py-2 h-[65px] w-full cursor-pointer border-0 text-gray-700",
                            "hover:bg-gray-700 hover:text-white",
                            "data-[state=open]:bg-gray-700 data-[state=open]:text-white",
                            "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                        )}
                    >
                        <User className="w-4 h-4" />
                        <span className="text-xs">{t('profile')}</span>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-auto mb-16"
                    style={{ direction: locale === 'fa' ? 'rtl' : 'ltr' }}
                >
                    {user.firstName && user.lastName && (
                        <>
                            <DropdownMenuLabel>{user.firstName + ' ' + user.lastName}</DropdownMenuLabel>
                            <DropdownMenuSeparator /></>
                    )}


                    {/* Language */}
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Globe className="w-4 h-4 text-gray-500" />
                        <Label>{t('language')}</Label>
                        <LocaleSwitcher />
                    </DropdownMenuItem>

                    {/* Theme */}
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Palette className="w-4 h-4 text-gray-500" />
                        <Label>{t('theme')}</Label>
                        <ModeToggle />
                    </DropdownMenuItem>

                    {/* Settings */}
                    <DropdownMenuItem className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <Link href="/profileee">{t('settings')}</Link>
                    </DropdownMenuItem>

                    {/* Dashboard */}
                    {user.accountType === 'ADMIN' && (
                        <DropdownMenuItem className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-gray-500" />
                            <Link href="/dashboard">{t('dashboard')}</Link>
                        </DropdownMenuItem>
                    )}



                    {/* Logout */}
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setOpen(true);
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Confirmation Modal */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent
                    className={locale === 'fa' ? 'rtl' : 'ltr'}
                >
                    <AlertDialogHeader className={locale === 'fa' ? '!text-right' : '!text-left'}>
                        <AlertDialogTitle>
                            {t('logoutTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('logoutDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter
                        className={locale === 'fa' ? 'flex-row-reverse gap-2' : ''}
                    >
                        <AlertDialogCancel>
                            {t('logoutCancel')}
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {t('logoutConfirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}