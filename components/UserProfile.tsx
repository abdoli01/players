'use client'

import React from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUser } from '@/store/slices/userSlice'
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function UserMenu() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)

    if (!user || !user.firstName) return null

    const handleLogout = () => {
        // در اینجا می‌توان API logout هم زد
        dispatch(setUser({ firstName: '', lastName: '', phone: '' }))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 capitalize">
                    <Avatar>
                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                    </Avatar>
                    {user.firstName} {user.lastName}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <Link href="/profile">پروفایل من</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>خروج از حساب</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
