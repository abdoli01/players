"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";

export default function GuestGate({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    const { user, hydrated } = useAppSelector((state) => state.user);
    const router = useRouter();
    const [isAssign,setIsAssign] = useState(false);

    useEffect(() => {
        if (hydrated && user && isAssign) {
            router.replace("/"); // یا /dashboard یا هر صفحه اصلی
        }
    }, [hydrated, user, router]);

    // if (!hydrated) return null;
    // if (user) return null;
    return <>{children}</>;
}
