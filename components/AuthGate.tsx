
"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGate({
                                     children,
                                 }: {
    children: React.ReactNode;
}) {
    const { user, hydrated } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (hydrated && !user) {
            router.replace("/login");
        }
    }, [hydrated, user, router]);

    if (!hydrated) return null;
    if (!user) return null;

    return <>{children}</>;
}
