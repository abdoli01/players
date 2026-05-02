"use client";

import * as React from "react";
import {useLocale, useTranslations} from "next-intl";
import { toast } from "react-toastify";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    useGetColorsQuery,
    useGetDefaultColorQuery,
} from "@/services/api/colorsApi";

import { useUpdateUserColorPaletteMutation } from "@/services/api/usersApi";

type Props = {
    userId: string;
};

type Mode = "DEFAULT" | "CUSTOM";

export function ChangeUserColorPaletteDialog({ userId }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);

    const [mode, setMode] = React.useState<Mode>("DEFAULT");
    const [selectedColorId, setSelectedColorId] = React.useState("");

    // API
    const { data: colors = [] } = useGetColorsQuery();
    const { data: defaultColor } = useGetDefaultColorQuery();

    const [updatePalette, { isLoading }] =
        useUpdateUserColorPaletteMutation();

    // وقتی حالت تغییر کرد، مقدار انتخابی reset بشه
    React.useEffect(() => {
        setSelectedColorId("");
    }, [mode]);

    const handleSave = async () => {
        try {
            if (mode === "DEFAULT") {
                await updatePalette({
                    id: userId,
                    body: {
                        colorPaletteType: "DEFAULT",
                        colorPaletteId: defaultColor?.id ?? "",
                    },
                }).unwrap();
            }

            if (mode === "CUSTOM") {
                await updatePalette({
                    id: userId,
                    body: {
                        colorPaletteType: "CUSTOM",
                        colorPaletteId: selectedColorId,
                    },
                }).unwrap();
            }

            toast.success(t("updateSuccess"));
            setOpen(false);
        } catch (e) {
            toast.error(t("updateError"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer px-2 py-1 text-sm">
                    {t("changeColorPalette")}
                </div>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className={isRtl ? '!text-right' : ''}>
                    <DialogTitle>
                        {t("changeColorPalette")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">

                    {/* MODE SELECT */}
                    <div className="space-y-2">
                        <Label>{t("paletteType")}</Label>

                        <RadioGroup
                            value={mode}
                            onValueChange={(v) => setMode(v as Mode)}
                            className="flex gap-4"
                            dir={isRtl ? "rtl" : "ltr"}
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="DEFAULT" />
                                <Label>{t("default")}</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="CUSTOM" />
                                <Label>{t("custom")}</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* DEFAULT INFO */}
                    {mode === "DEFAULT" && (
                        <div className="text-sm text-muted-foreground">
                            {t("defaultWillBeUsed")}
                        </div>
                    )}

                    {/* CUSTOM SELECT */}
                    {mode === "CUSTOM" && (
                        <Select
                            value={selectedColorId}
                            onValueChange={setSelectedColorId}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t("selectColorPalette")}
                                />
                            </SelectTrigger>

                            <SelectContent>
                                {colors.map((color) => (
                                    <SelectItem
                                        key={color.id}
                                        value={color.id}
                                    >
                                        {color.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* SAVE */}
                    <Button
                        onClick={handleSave}
                        disabled={
                            isLoading ||
                            (mode === "CUSTOM" && !selectedColorId)
                        }
                        className="w-full"
                    >
                        {t("save")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}