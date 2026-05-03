"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-toastify";

import { Spinner } from "@/components/Spinner";
import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";

import {
    useGetSettingsLanguageQuery,
    useUpdateSettingsLanguageMutation,
} from "@/services/api/settingsApi";

import { useGetLanguagesQuery } from "@/services/api/languagesApi";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function LanguageSettings() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isFa = locale === "fa";

    // APIs
    const { data: currentLanguage, isLoading: isLoadingCurrent } =
        useGetSettingsLanguageQuery();

    const { data: languages = [], isLoading: isLoadingLanguages } =
        useGetLanguagesQuery();

    const [updateLanguage, { isLoading: isUpdating }] =
        useUpdateSettingsLanguageMutation();

    // state
    const [selectedLanguageId, setSelectedLanguageId] =
        React.useState<string>("");

    // sync default
    React.useEffect(() => {
        if (currentLanguage?.defaultLanguageId) {
            setSelectedLanguageId(currentLanguage.defaultLanguageId);
        }
    }, [currentLanguage]);

    const handleSave = async () => {
        if (!selectedLanguageId) return;

        try {
            await updateLanguage({
                defaultLanguageId: selectedLanguageId,
            }).unwrap();

            toast.success(t("updateSuccess"));
        } catch {
            toast.error(t("updateError"));
        }
    };

    if (isLoadingCurrent || isLoadingLanguages) {
        return <Spinner />;
    }

    return (
        <div className="w-full space-y-6">
            <PageHeader title={t("languageSettings")} />

            <div className="max-w-md space-y-2">
                {/* LABEL */}
                <Label>{t("selectLanguage")}</Label>

                <div className="flex gap-2">
                    <Select
                        value={selectedLanguageId || ""}
                        onValueChange={setSelectedLanguageId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("selectLanguage")} />
                        </SelectTrigger>

                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang.id} value={lang.id}>
                                    {isFa
                                        ? lang.fullName
                                        : lang.fullNameEn || lang.fullName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleSave}
                        disabled={isUpdating || !selectedLanguageId}
                    >
                        {t("update")}
                    </Button>
                </div>
            </div>
        </div>
    );
}