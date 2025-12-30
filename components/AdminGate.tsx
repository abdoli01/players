"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGate({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    const { user, hydrated } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (!hydrated) return;

        // لاگین نیست
        if (!user) {
            router.replace("/login");
            return;
        }

        // لاگین هست ولی ADMIN نیست
        if (user.accountType !== "ADMIN") {
            router.replace("/"); // یا /dashboard
        }
    }, [hydrated, user, router]);

    if (!hydrated) return null;
    if (!user) return null;
    if (user.accountType !== "ADMIN") return null;

    return <>{children}</>;
}
