import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import {cn} from "@/lib/utils";
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {ModeToggle} from  '@/components/Theme'
import { Label } from "@/components/ui/label"
import Link from "next/link";

export function SidebarProfile() {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex flex-col items-center justify-center gap-2 px-3 py-2 h-[65px] w-full cursor-pointer border-0 border-none text-gray-700 ",
                        "hover:bg-gray-700 hover:text-white",
                        "data-[state=open]:bg-gray-700 data-[state=open]:text-white",
                        "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                    )}
                >
                    <User className="w-4 h-4" />
                    <span className="text-xs">پروفایل</span>
                </button>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="right"
                align="start"
                className="w-auto mb-16"
            >
                <DropdownMenuItem>
                    <Label>Language</Label>
                    <LocaleSwitcher/>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Label>Theme</Label>
                    <ModeToggle/>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/profileee">Settings</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
