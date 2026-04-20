"use client";

import * as React from "react";
import { useGetMyColorPaletteQuery } from "@/services/api/usersApi";
import { applyUserColors } from "@/utils/applyUserColors";
import { useAppSelector } from "@/store/hooks";


export function UserColorProvider() {
    const user = useAppSelector(s => s.user.user); // ✅ اضافه شد

    const { data } = useGetMyColorPaletteQuery(undefined,{ skip: !user});

    React.useEffect(() => {
        if (!data) return;

        // اگر API مستقیم Color برمی‌گردونه:
        applyUserColors(data);

        // اگر wrapper بود:
        // applyUserColors(data.color)
    }, [data]);

    return null;
}