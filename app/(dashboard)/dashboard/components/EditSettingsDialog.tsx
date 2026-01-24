"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";

import { Settings, UpdateSettingsDto } from "@/types/settings";
import { useUpdateSettingsMutation } from "@/services/api/settingsApi";
import { useGetSeasonsQuery } from "@/services/api/seasonsApi";

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

const editSettingsSchema = z.object({
    currentSeasonId: z.string().min(1, "انتخاب فصل الزامی است"),
});

type EditSettingsFormValues = z.infer<typeof editSettingsSchema>;

interface Props {
    settings: Settings;
}

export function EditSettingsDialog({ settings }: Props) {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

    const { data: seasons = [], isLoading: isLoadingSeasons } = useGetSeasonsQuery();

    const form = useForm<EditSettingsFormValues>({
        resolver: zodResolver(editSettingsSchema),
        defaultValues: { currentSeasonId: settings.currentSeasonId },
    });

    const onSubmit = async (values: EditSettingsFormValues) => {
        try {
            await updateSettings(values).unwrap();
            toast.success(tp("successAction"));
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(tp("errorAction"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    {t("edit")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("editSettings")}</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div>
                        <Label>{t("currentSeason")}</Label>
                        <Select
                            value={form.watch("currentSeasonId")}
                            onValueChange={(val) => form.setValue("currentSeasonId", val)}
                            disabled={isLoadingSeasons}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("selectSeason")} />
                            </SelectTrigger>
                            <SelectContent>
                                {seasons.map((season:any) => (
                                    <SelectItem key={season.id} value={season.id}>
                                        {locale === "fa" ? season.fullName : season.fullNameEn}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <DialogClose className="px-4 py-2 bg-muted rounded">{t("cancel")}</DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? t("saving") : t("save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
