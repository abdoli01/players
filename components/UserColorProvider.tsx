"use client";

import * as React from "react";
import { useGetMyColorPaletteQuery } from "@/services/api/usersApi";
import { applyUserColors } from "@/utils/applyUserColors";

export function UserColorProvider({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    const { data } = useGetMyColorPaletteQuery();

    React.useEffect(() => {
        if (!data) return;

        // اگر API مستقیم Color برمی‌گردونه:
        applyUserColors(data);

        // اگر wrapper بود:
        // applyUserColors(data.color)
    }, [data]);

    return <>{children}</>;
}