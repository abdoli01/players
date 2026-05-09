"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetMyLanguageQuery } from "@/services/api/usersApi";

export function UserLanguageProvider() {
    const user = useAppSelector(s => s.user.user);
    const router = useRouter();

    const { data } = useGetMyLanguageQuery(undefined, {
        skip: !user
    });

    React.useEffect(() => {
        if (!user || !data?.languageId) return;

        const target =
            data.languageId === "01fa0237-8795-4c00-8d0e-d2655aad1ae9"
                ? "en"
                : "fa";

        const cookieLang = document.cookie
            .split("; ")
            .find(row => row.startsWith("locale="))
            ?.split("=")[1];

        if (target !== cookieLang) {
            document.cookie = `locale=${target}; path=/; max-age=31536000`;
            setTimeout(()=>{window.location.reload()},500)
            // router.refresh();
        }
    }, [data, user, router]);

    return null;
}