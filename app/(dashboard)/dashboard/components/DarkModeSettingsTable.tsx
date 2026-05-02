"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { Spinner } from "@/components/Spinner";
import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";

import {
    useGetSettingsDarkModeQuery,
    useUpdateSettingsDarkModeMutation,
} from "@/services/api/settingsApi";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function DarkModeSettingsTable() {
    const t = useTranslations("Dashboard");

    // -----------------------
    // API
    // -----------------------
    const { data, isLoading } = useGetSettingsDarkModeQuery();

    const [updateDarkMode, { isLoading: isUpdating }] =
        useUpdateSettingsDarkModeMutation();

    // -----------------------
    // state
    // -----------------------
    const [enabled, setEnabled] = React.useState(false);

    // sync API → state
    React.useEffect(() => {
        if (typeof data?.defaultDarkMode === "boolean") {
            setEnabled(data.defaultDarkMode);
        }
    }, [data]);

    // -----------------------
    // toggle + auto save
    // -----------------------
    const handleToggle = async (value: boolean) => {
        const prev = enabled;

        // optimistic update
        setEnabled(value);

        try {
            await updateDarkMode({
                defaultDarkMode: value,
            }).unwrap();

            toast.success(t("updateSuccess"));
        } catch (error) {
            // rollback
            setEnabled(prev);
            toast.error(t("updateError"));
        }
    };

    // -----------------------
    // loading
    // -----------------------
    if (isLoading) return <Spinner />;

    return (
        <div className="w-full space-y-6">
            <PageHeader title={t("darkModeSettings")} />

            {/* CARD */}
            <div className="flex items-center justify-between rounded-md border p-4">

                <div className="flex flex-col gap-1">
                    <span className="font-medium">
                        {t("darkMode")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {t("darkModeDescription")}
                    </span>
                </div>

                {/* SWITCH */}
                <div dir="ltr">
                    <Switch
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        disabled={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
}