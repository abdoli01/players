"use client";

import * as React from "react";
import { useCreateColorMutation } from "@/services/api/colorsApi";
import { CreateColorDto } from "@/types/color";

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

/* =========================
   Schema
========================= */
const createColorSchema = z.object({
    title: z.string().min(1, "عنوان رنگ الزامی است"),
    H1: z.string().min(1, "H1 الزامی است"),
    H2: z.string().optional(),
    G1: z.string().optional(),
    G2: z.string().optional(),
    HG3: z.string().optional(),
    HG4: z.string().optional(),
    ACN1: z.string().optional(),
    ACN2: z.string().optional(),
});

type CreateColorFormValues = z.infer<typeof createColorSchema>;

/* =========================
   Component
========================= */
export function CreateColorDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [createColor, { isLoading }] = useCreateColorMutation();

    const form = useForm<CreateColorFormValues>({
        resolver: zodResolver(createColorSchema),
        mode: "onSubmit",
        defaultValues: {
            title: "",
            H1: "",
            H2: "",
            G1: "",
            G2: "",
            HG3: "",
            HG4: "",
            ACN1: "",
            ACN2: "",
        },
    });

    const onSubmit = async (values: CreateColorFormValues) => {
        try {
            const payload: CreateColorDto = { ...values };

            await createColor(payload).unwrap();

            toast.success("رنگ با موفقیت ایجاد شد");
            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;

            if (status === 400) toast.error("داده‌های ورودی نامعتبر است");
            else if (status === 401) toast.error("نیاز به ورود مجدد");
            else if (status === 403) toast.error("دسترسی فقط برای ادمین");
            else toast.error("خطای غیرمنتظره رخ داد");
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
                <Button>{t("createColor")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("createColor")}</DialogTitle>
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
                        <DialogClose
                            type="button"
                            className="px-4 py-2 bg-muted rounded"
                        >
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