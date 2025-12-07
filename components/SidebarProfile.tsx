import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Globe, Palette, Settings,LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { ModeToggle } from '@/components/Theme';
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function SidebarProfile() {
    return (
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

                <DropdownMenuItem
                    className="flex items-center gap-2"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Globe className="w-4 h-4 text-gray-500" />
                    <Label>Language</Label>
                    <LocaleSwitcher />
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-2"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Palette className="w-4 h-4 text-gray-500" />
                    <Label>Theme</Label>
                    <ModeToggle />
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <Link href="/profileee">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    );
}
