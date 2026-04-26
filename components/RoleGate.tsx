"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

interface RoleGateProps {
    children: React.ReactNode;

    allowedRoles: string[];

    // اگر لاگین نبود
    loginRedirect?: string;

    // اگر لاگین بود ولی دسترسی نداشت
    unauthorizedRedirect?: string;

    // اگر هنوز redux hydrate نشده
    loadingFallback?: React.ReactNode;
}

export default function RoleGate({
                                     children,
                                     allowedRoles,
                                     loginRedirect = "/login",
                                     unauthorizedRedirect = "/dashboard",
                                     loadingFallback = null,
                                 }: RoleGateProps) {
    const { user, hydrated } = useAppSelector((state) => state.user);
    const router = useRouter();

    const isAllowed = useMemo(() => {
        return !!user && allowedRoles.includes(user.accountType);
    }, [user, allowedRoles]);

    useEffect(() => {
        if (!hydrated) return;

        // 1. لاگین نیست
        if (!user) {
            router.replace(loginRedirect);
            return;
        }

        // 2. لاگین هست ولی دسترسی ندارد
        if (!isAllowed) {
            router.replace(unauthorizedRedirect);
            return;
        }
    }, [hydrated, user, isAllowed, router, loginRedirect, unauthorizedRedirect]);

    // هنوز store لود نشده
    if (!hydrated) return loadingFallback;

    // لاگین نیست
    if (!user) return null;

    // دسترسی ندارد
    if (!isAllowed) return null;

    return <>{children}</>;
}