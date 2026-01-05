"use client";

import * as React from "react";
import { useCreateSeasonMutation } from "@/services/api/seasonsApi";
import { CreateSeasonDto } from "@/types/season";

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
   Zod Schema
========================= */
const createSeasonSchema = z.object({
    fullName: z
        .string()
        .min(1, "نام کامل فصل الزامی است")
        .max(255, "حداکثر ۲۵۵ کاراکتر"),
    shortName: z.string().max(255).optional().or(z.literal("")),
    fullNameEn: z.string().max(255).optional().or(z.literal("")),
    shortNameEn: z.string().max(255).optional().or(z.literal("")),
});

type CreateSeasonFormValues = z.infer<typeof createSeasonSchema>;

/* =========================
   Component
========================= */
export function CreateSeasonDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [createSeason, { isLoading }] = useCreateSeasonMutation();

    const form = useForm<CreateSeasonFormValues>({
        resolver: zodResolver(createSeasonSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: "",
            shortName: "",
            fullNameEn: "",
            shortNameEn: "",
        },
    });

    /* =========================
       Submit
    ========================= */
    const onSubmit = async (values: CreateSeasonFormValues) => {
        try {
            const payload: CreateSeasonDto = {
                fullName: values.fullName,
                shortName: values.shortName || undefined,
                fullNameEn: values.fullNameEn || undefined,
                shortNameEn: values.shortNameEn || undefined,
            };

            await createSeason(payload).unwrap();

            toast.success("فصل با موفقیت ایجاد شد");
            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;
            if (status === 400) toast.error("اطلاعات وارد شده نامعتبر است");
            else if (status === 401) toast.error("نیاز به ورود مجدد");
            else if (status === 403) toast.error("دسترسی غیرمجاز");
            else toast.error("خطای غیرمنتظره‌ای رخ داد");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("createSeason")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("createSeason")}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4"
                >
                    {/* Full Name */}
                    <div className="col-span-2">
                        <Label className="mb-1">{t("fullName")}</Label>
                        <Input {...form.register("fullName")} />
                        {form.formState.errors.fullName && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.fullName.message}
                            </p>
                        )}
                    </div>

                    {/* Short Name */}
                    <div>
                        <Label className="mb-1">{t("shortName")}</Label>
                        <Input {...form.register("shortName")} />
                    </div>

                    {/* Short Name EN */}
                    <div>
                        <Label className="mb-1">{t("shortNameEn")}</Label>
                        <Input {...form.register("shortNameEn")} />
                    </div>

                    {/* Full Name EN */}
                    <div className="col-span-2">
                        <Label className="mb-1">{t("fullNameEn")}</Label>
                        <Input {...form.register("fullNameEn")} />
                    </div>

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
