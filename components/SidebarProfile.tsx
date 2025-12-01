import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import {cn} from "@/lib/utils";

export function SidebarProfile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex flex-col items-center justify-center gap-2 px-3 py-2 transition-colors h-[65px] w-full cursor-pointer border-0 border-none",
                        "text-gray-700 hover:bg-gray-700 hover:text-white",
                        "data-[state=open]:bg-gray-700 text-white",
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
                className="w-40 mb-16"
            >
                <DropdownMenuItem onClick={() => console.log("پروفایل")}>
                    مشاهده پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("تنظیمات")}>
                    تنظیمات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("خروج")}>
                    خروج
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
