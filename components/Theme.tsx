"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    const toggle = () => setTheme(isDark ? "light" : "dark")

    return (
        <label className="relative inline-block w-[52px] h-[28px] cursor-pointer">
            {/* Hidden Checkbox */}
            <input
                type="checkbox"
                checked={isDark}
                onChange={toggle}
                className="sr-only"
            />

            {/* Track */}
            <div
                className={cn(
                    "w-full h-full rounded-full transition-colors",
                    isDark ? "bg-white/90" : "bg-gray-800"
                )}
            />

            {/* Thumb */}
            <div
                className={cn(
                    "absolute top-1 h-[22px] w-[22px] rounded-full flex items-center justify-center transition-transform",
                    isDark ? "right-1" : "left-1"
                )}
            >
                <Sun
                    className={cn(
                        "absolute h-4 w-4 text-yellow-500 transition-all",
                        isDark ? "opacity-0 scale-75" : "opacity-100 scale-100"
                    )}
                />
                <Moon
                    className={cn(
                        "absolute h-4 w-4 text-blue-400 transition-all",
                        isDark ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    )}
                />
            </div>
        </label>
    )
}
