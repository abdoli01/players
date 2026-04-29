"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/Spinner";
import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";

import { useGetSeasonsQuery } from "@/services/api/seasonsApi";

import {
    useGetSettingsCurrentSeasonIdQuery,
    useUpdateSettingsSeasonMutation,
} from "@/services/api/settingsApi";

export function CurrentSeasonSettings() {
    const t = useTranslations("Dashboard");

    // -----------------------
    // API
    // -----------------------
    const { data: seasons = [], isLoading: isLoadingSeasons } =
        useGetSeasonsQuery();

    const { data: currentSeason, isLoading: isLoadingCurrent } =
        useGetSettingsCurrentSeasonIdQuery();

    const [updateSeason, { isLoading: isUpdating }] =
        useUpdateSettingsSeasonMutation();

    // -----------------------
    // state
    // -----------------------
    const [selectedSeasonId, setSelectedSeasonId] =
        React.useState<string>("");

    React.useEffect(() => {
        if (currentSeason?.currentSeasonId) {
            setSelectedSeasonId(currentSeason.currentSeasonId);
        }
    }, [currentSeason]);

    // -----------------------
    // update handler
    // -----------------------
    const handleUpdate = async () => {
        if (!selectedSeasonId) return;

        try {
            await updateSeason({
                currentSeasonId: selectedSeasonId,
            }).unwrap();

            toast.success(t("seasonUpdatedSuccess"));
        } catch (error) {
            toast.error(t("seasonUpdatedError"));
        }
    };

    if (isLoadingSeasons || isLoadingCurrent) return <Spinner />;

    return (
        <div className="w-full space-y-6">
            <PageHeader title={t("currentSeason")} />

            <div className="flex items-end gap-2">
                <div className="flex flex-col gap-2 max-w-md">
                    <Label>{t("selectSeason")}</Label>

                    <Select
                        value={selectedSeasonId}
                        onValueChange={setSelectedSeasonId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("selectSeason")} />
                        </SelectTrigger>

                        <SelectContent>
                            {seasons.map((season) => (
                                <SelectItem
                                    key={season.id}
                                    value={season.id}
                                >
                                    {season.fullName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={handleUpdate}
                    disabled={isUpdating || !selectedSeasonId}
                >
                    {t("update")}
                </Button>
            </div>
        </div>
    );
}