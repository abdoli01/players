"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { useUpdateSettingsMutation } from "@/services/api/settingsApi";
import { useGetSeasonsQuery } from "@/services/api/seasonsApi";
import { Settings, UpdateSettingsDto } from "@/types/settings";
import { Season } from "@/types/season";

/* =========================
   Zod Schema
========================= */
const editSettingsSchema = z.object({
    currentSeasonId: z.string().min(1, "Please select a season"),
});

type EditSettingsFormValues = z.infer<typeof editSettingsSchema>;

interface Props {
    settings: Settings;
}

/* =========================
   Component
========================= */
export function EditSettingsDialog({ settings }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

    // Form
    const form = useForm<EditSettingsFormValues>({
        resolver: zodResolver(editSettingsSchema),
        mode: "onSubmit",
        defaultValues: {
            currentSeasonId: settings.currentSeasonId,
        },
    });

    // Fetch seasons
    const { data: seasons = [], isLoading: isLoadingSeasons } = useGetSeasonsQuery();

    const onSubmit = async (values: EditSettingsFormValues) => {
        try {
            const payload: UpdateSettingsDto = { ...values };
            await updateSettings(payload).unwrap();
            toast.success(t("Common.successAction"));
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(t("Common.errorAction"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">{t("edit")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("editSettings")}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-4 py-4"
                >
                    {/* Season Select */}
                    <div>
                        <Label className="mb-1">{t("currentSeason")}</Label>
                        <Select
                            value={form.watch("currentSeasonId")}
                            onValueChange={(val) => form.setValue("currentSeasonId", val)}
                            disabled={isLoadingSeasons || isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("selectSeason")} />
                            </SelectTrigger>
                            <SelectContent>
                                {seasons.map((season: Season) => (
                                    <SelectItem key={season.id} value={season.id}>
                                        {locale === "fa" ? season.fullName : season.fullNameEn}
                                    </SelectItem>
                                ))}
                                {seasons.length === 0 && !isLoadingSeasons && (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        {t("Common.noResultsFound")}
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <DialogClose className="px-4 py-2 bg-muted rounded">
                            {t("cancel")}
                        </DialogClose>
                        <Button type="submit" disabled={isLoading || isLoadingSeasons}>
                            {isLoading ? t("saving") : t("save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
