"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

export function SidebarProfile() {
    const logout = useLogout();
    const [open, setOpen] = useState(false);

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
                        <span className="text-xs">Profile</span>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="right" align="start" className="w-auto mb-16">

                    {/* Language */}
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Globe className="w-4 h-4 text-gray-500" />
                        <Label>Language</Label>
                        <LocaleSwitcher />
                    </DropdownMenuItem>

                    {/* Theme */}
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Palette className="w-4 h-4 text-gray-500" />
                        <Label>Theme</Label>
                        <ModeToggle />
                    </DropdownMenuItem>

                    {/* Settings */}
                    <DropdownMenuItem className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <Link href="/profileee">Settings</Link>
                    </DropdownMenuItem>

                    {/* Dashboard */}
                    <DropdownMenuItem className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-gray-500" />
                        <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>

                    {/* Logout */}
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setOpen(true); // 👈 باز شدن مدال
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            {/* 🧠 Logout Confirmation Modal */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            خروج از حساب
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            انصراف
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={logout}
                        >
                            خروج
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
