"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useGetMyDarkModeQuery } from "@/services/api/usersApi"
import { useAppSelector } from "@/store/hooks"

export function ThemeSyncProvider() {
    const user = useAppSelector((s) => s.user.user)
    const { setTheme, theme } = useTheme()

    const { data, isSuccess } = useGetMyDarkModeQuery(undefined, {
        skip: !user?.id,
    })

    useEffect(() => {
        if (!isSuccess || !data) return

        const backendTheme = data.darkMode ? "dark" : "light"

        // 🔥 مهم: فقط وقتی فرق دارد تغییر بده
        if (theme !== backendTheme) {
            console.log('hiiii')
            console.log('theme',theme)
            console.log('backendTheme',backendTheme)
            setTheme(backendTheme)
        }

    }, [isSuccess, data, theme, setTheme])

    return null
}