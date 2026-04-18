"use client";

import * as React from "react";
import { Color, UpdateColorDto } from "@/types/color";
import {
    useUpdateColorMutation,
    useUpdateDefaultColorMutation,
} from "@/services/api/colorsApi";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    colorData: Color;
    isDefault?: boolean;
}

export function EditColorDialog({
                                    colorData,
                                    isDefault = false,
                                }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);

    const [updateColor, { isLoading: isUpdating }] =
        useUpdateColorMutation();

    const [updateDefaultColor, { isLoading: isUpdatingDefault }] =
        useUpdateDefaultColorMutation();

    const isLoading = isUpdating || isUpdatingDefault;

    const editColorSchema = React.useMemo(
        () =>
            z.object({
                title: z.string().min(1, t("colorTitleRequired")),
                H1: z.string().min(1, t("H1Required")),
                H2: z.string().optional(),
                G1: z.string().optional(),
                G2: z.string().optional(),
                HG3: z.string().optional(),
                HG4: z.string().optional(),
                ACN1: z.string().optional(),
                ACN2: z.string().optional(),
            }),
        [t]
    );

    type EditColorFormValues = z.infer<typeof editColorSchema>;

    const form = useForm<EditColorFormValues>({
        resolver: zodResolver(editColorSchema),
        mode: "onSubmit",
        defaultValues: {
            title: colorData.title ?? "",
            H1: colorData.H1 ?? "",
            H2: colorData.H2 ?? "",
            G1: colorData.G1 ?? "",
            G2: colorData.G2 ?? "",
            HG3: colorData.HG3 ?? "",
            HG4: colorData.HG4 ?? "",
            ACN1: colorData.ACN1 ?? "",
            ACN2: colorData.ACN2 ?? "",
        },
    });

    React.useEffect(() => {
        if (open) {
            form.reset({
                title: colorData.title ?? "",
                H1: colorData.H1 ?? "",
                H2: colorData.H2 ?? "",
                G1: colorData.G1 ?? "",
                G2: colorData.G2 ?? "",
                HG3: colorData.HG3 ?? "",
                HG4: colorData.HG4 ?? "",
                ACN1: colorData.ACN1 ?? "",
                ACN2: colorData.ACN2 ?? "",
            });
        }
    }, [open, colorData, form]);

    const onSubmit = async (values: EditColorFormValues) => {
        try {
            const payload: UpdateColorDto = {
                title: values.title,
                H1: values.H1,
                H2: values.H2 === "" ? null : values.H2,
                G1: values.G1 === "" ? null : values.G1,
                G2: values.G2 === "" ? null : values.G2,
                HG3: values.HG3 === "" ? null : values.HG3,
                HG4: values.HG4 === "" ? null : values.HG4,
                ACN1: values.ACN1 === "" ? null : values.ACN1,
                ACN2: values.ACN2 === "" ? null : values.ACN2,
            };

            if (isDefault) {
                await updateDefaultColor(payload).unwrap();
            } else {
                await updateColor({
                    id: colorData.id,
                    body: payload,
                }).unwrap();
            }

            toast.success(t("colorUpdated"));
            setOpen(false);
        } catch (err: any) {
            const status = err?.status;

            if (status === 400) toast.error(t("invalidInput"));
            else if (status === 401) toast.error(t("loginRequired"));
            else if (status === 403) toast.error(t("adminOnly"));
            else if (status === 404) toast.error(t("colorNotFound"));
            else toast.error(t("updateError"));
        }
    };

    const fields = [
        "H1",
        "H2",
        "G1",
        "G2",
        "HG3",
        "HG4",
        "ACN1",
        "ACN2",
    ] as const;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    {t("edit")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>
                        {isDefault
                            ? t("editDefaultColor")
                            : t("editColor")}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4"
                >
                    {/* Title */}
                    <div className="col-span-2">
                        <Label className="mb-1.5">{t("title")}</Label>
                        <Input {...form.register("title")} />

                        {form.formState.errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Color Fields */}
                    {fields.map((field) => (
                        <div key={field}>
                            <Label className="mb-1.5">{t(field)}</Label>

                            <Input
                                placeholder="oklch(0.6 0.15 250)"
                                {...form.register(field)}
                            />

                            {form.formState.errors[field] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.formState.errors[field]?.message}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Footer */}
                    <DialogFooter className="col-span-2 mt-4 flex justify-end gap-2">
                        <DialogClose className="px-4 py-2 bg-muted rounded">
                            {t("cancel")}
                        </DialogClose>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? t("saving") : t("save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}