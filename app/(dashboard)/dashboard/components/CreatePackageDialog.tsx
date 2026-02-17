"use client";

import * as React from "react";
import { useCreatePackageMutation } from "@/services/api/packagesApi";
import { CreatePackageDto } from "@/types/package";

import { useForm, Controller } from "react-hook-form";
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
   Helpers
========================= */
const formatNumber = (value: number | string) => {
    if (value === "" || value === null || value === undefined) return "";
    return Number(value).toLocaleString("en-US");
};

const parseNumber = (value: string) => {
    return Number(value.replace(/,/g, ""));
};

/* =========================
   Zod Schema
========================= */
const createPackageSchema = z.object({
    title: z.string().min(1, "عنوان پکیج الزامی است"),
    description: z.string().optional(),
    originalPrice: z.number().min(0, "قیمت اصلی معتبر نیست"),
    discountPrice: z.number().min(0).optional(),
    freeUsageDays: z.number().min(0).optional(),
    freeDisplayMinutes: z.number().min(0).optional(),
    freeDownloadMinutes: z.number().min(0).optional(),
    usageDays: z.number().min(0).optional(),
    displayMinutes: z.number().min(0).optional(),
    downloadMinutes: z.number().min(0).optional(),
});

type CreatePackageFormValues = z.infer<typeof createPackageSchema>;

/* =========================
   Component
========================= */
export function CreatePackageDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [createPackage, { isLoading }] = useCreatePackageMutation();

    const form = useForm<CreatePackageFormValues>({
        resolver: zodResolver(createPackageSchema),
        mode: "onSubmit",
        defaultValues: {
            title: "",
            description: "",
            originalPrice: 0,
            discountPrice: 0,
            freeUsageDays: 0,
            freeDisplayMinutes: 0,
            freeDownloadMinutes: 0,
            usageDays: 0,
            displayMinutes: 0,
            downloadMinutes: 0,
        },
    });

    /* =========================
       Submit
    ========================== */
    const onSubmit = async (values: CreatePackageFormValues) => {
        try {
            const payload: CreatePackageDto = { ...values };
            await createPackage(payload).unwrap();

            toast.success("پکیج با موفقیت ایجاد شد");
            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;
            if (status === 400) toast.error("داده‌های ورودی نامعتبر است");
            else if (status === 401) toast.error("نیاز به ورود مجدد");
            else toast.error("خطای غیرمنتظره رخ داد");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("createPackage")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("createPackage")}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4"
                >
                    {/* Title */}
                    <div>
                        <Label className="mb-1.5">{t("title")}</Label>
                        <Input {...form.register("title")} />
                        {form.formState.errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                        <Label className="mb-1.5">{t("description")}</Label>
                        <Input {...form.register("description")} />
                    </div>

                    {/* Original Price */}
                    <div>
                        <Label className="mb-1.5">{t("originalPrice")}</Label>
                        <Controller
                            control={form.control}
                            name="originalPrice"
                            render={({ field }) => (
                                <Input
                                    inputMode="numeric"
                                    value={formatNumber(field.value)}
                                    onChange={(e) => {
                                        const raw = parseNumber(e.target.value);
                                        field.onChange(raw);
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Discount Price */}
                    <div>
                        <Label className="mb-1.5">{t("discountPrice")}</Label>
                        <Controller
                            control={form.control}
                            name="discountPrice"
                            render={({ field }) => (
                                <Input
                                    inputMode="numeric"
                                    value={formatNumber(field.value ?? "")}
                                    onChange={(e) => {
                                        const raw = parseNumber(e.target.value);
                                        field.onChange(raw);
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Free Usage Days */}
                    <div>
                        <Label className="mb-1.5">{t("freeUsageDays")}</Label>
                        <Input
                            type="number"
                            {...form.register("freeUsageDays", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Free Display Minutes */}
                    <div>
                        <Label className="mb-1.5">{t("freeDisplayMinutes")}</Label>
                        <Input
                            type="number"
                            {...form.register("freeDisplayMinutes", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Free Download Minutes */}
                    <div>
                        <Label className="mb-1.5">{t("freeDownloadMinutes")}</Label>
                        <Input
                            type="number"
                            {...form.register("freeDownloadMinutes", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Usage Days */}
                    <div>
                        <Label className="mb-1.5">{t("usageDays")}</Label>
                        <Input
                            type="number"
                            {...form.register("usageDays", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Display Minutes */}
                    <div>
                        <Label className="mb-1.5">{t("displayMinutes")}</Label>
                        <Input
                            type="number"
                            {...form.register("displayMinutes", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Download Minutes */}
                    <div>
                        <Label className="mb-1.5">{t("downloadMinutes")}</Label>
                        <Input
                            type="number"
                            {...form.register("downloadMinutes", { valueAsNumber: true })}
                        />
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
