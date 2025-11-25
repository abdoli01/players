"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

function getInitialLocale() {
    if (typeof document === "undefined") return "fa";

    const cookieLocale = document.cookie
        .split("; ")
        .find((row) => row.startsWith("locale="))
        ?.split("=")[1];

    return cookieLocale || "fa";
}

export default function LocaleSwitcher() {
    const [currentLocale, setCurrentLocale] = React.useState<string>(getInitialLocale);

    const changeLanguage = (locale: string) => {
        document.cookie = `locale=${locale}; path=/; max-age=31536000`;
        window.location.reload();
    };

    return (
        <Select
            value={currentLocale}
            onValueChange={(value) => changeLanguage(value)}
        >
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="fa">🇮🇷 فارسی</SelectItem>
            </SelectContent>
        </Select>
    );
}
