"use client"

import * as React from "react"
import { Moon, Sun, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"

import { useUpdateMyDarkModeMutation } from "@/services/api/usersApi"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [updateDarkMode, { isLoading }] = useUpdateMyDarkModeMutation()

    const currentTheme = theme ?? "light"
    const isDark = currentTheme === "dark"

    const toggleTheme = async () => {
        const nextTheme = isDark ? "light" : "dark"

        // optimistic UI
        setTheme(nextTheme)

        try {
            await updateDarkMode({
                darkMode: nextTheme === "dark",
                useSystemDarkMode: false,
            }).unwrap()
        } catch (err) {
            // rollback
            setTheme(currentTheme)
            toast.error("Failed to update theme")
        }
    }

    return (
        <button
            onClick={toggleTheme}
            disabled={isLoading}
            className="relative inline-flex w-[52px] h-[28px] cursor-pointer"
        >
            {/* Track */}
            <div
                className={cn(
                    "w-full h-full rounded-full transition-colors",
                    isDark ? "bg-white/90" : "bg-gray-800",
                    isLoading && "opacity-70"
                )}
            />

            {/* Thumb */}
            <div
                className={cn(
                    "absolute top-1 h-[22px] w-[22px] rounded-full flex items-center justify-center transition-all duration-300",
                    isDark ? "right-1" : "left-1"
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </button>
    )
}