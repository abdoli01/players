"use client";

import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useGetSettingsVisibleLanguagesQuery } from "@/services/api/settingsApi";

import { useUpdateMyLanguageMutation } from "@/services/api/usersApi";

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

    const {
        data,
        isLoading,
    } = useGetSettingsVisibleLanguagesQuery();

    const [updateMyLanguage, { isLoading: isUpdating }] =
        useUpdateMyLanguageMutation();

    const languages = data?.items || [];

    const changeLanguage = async (locale: string) => {
        try {
            const selectedLanguage = languages.find(
                (language) => language.code === locale
            );

            if (!selectedLanguage) return;

            setCurrentLocale(locale);

            // ذخیره داخل cookie
            document.cookie = `locale=${locale}; path=/; max-age=31536000`;

            // فراخوانی API
            await updateMyLanguage({
                languageId: selectedLanguage.id,
                useSystemLanguage: false,
            }).unwrap();

            // reload
            window.location.reload();

        } catch (error) {
            console.error("Failed to update language:", error);
        }
    };

    return (
        <Select
            value={currentLocale}
            onValueChange={changeLanguage}
            disabled={isLoading || isUpdating}
        >
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>

            <SelectContent>
                {languages.map((language) => (
                    <SelectItem
                        key={language.id}
                        value={language.code}
                    >
                        {language.code.toUpperCase()} - {language.fullName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}