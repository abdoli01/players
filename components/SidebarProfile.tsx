import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export function SidebarProfile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={`
            w-full flex flex-col items-center justify-center gap-1 py-4 
            hover:bg-gray-200 transition-colors
            data-[state=open]:bg-gray-300
          `}
                >
                    <User className="w-5 h-5" />
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
