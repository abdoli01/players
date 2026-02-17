"use client";

import * as React from "react";
import { Package, UpdatePackageDto } from "@/types/package";
import { useUpdatePackageMutation } from "@/services/api/packagesApi";

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
   Helper Functions
========================= */
const formatNumber = (value?: number | string) => {
    if (value === null || value === undefined || value === "") return "";
    return new Intl.NumberFormat("en-US").format(Number(value));
};

const parseNumber = (value: string) => value.replace(/,/g, "");

/* =========================
   Zod Schema
========================= */
const editPackageSchema = z.object({
    title: z.string().min(1, "عنوان پکیج الزامی است"),
    description: z.string().optional(),
    originalPrice: z.number().min(0, "قیمت اصلی معتبر نیست"),
    discountPrice: z.number().min(0, "قیمت تخفیف معتبر نیست"),
    freeUsageDays: z.number().min(0).optional(),
    freeDisplayMinutes: z.number().min(0).optional(),
    freeDownloadMinutes: z.number().min(0).optional(),
    usageDays: z.number().min(0).optional(),
    displayMinutes: z.number().min(0).optional(),
    downloadMinutes: z.number().min(0).optional(),
});

type EditPackageFormValues = z.infer<typeof editPackageSchema>;

interface Props {
    packageData: Package;
}

/* =========================
   Component
========================= */
export function EditPackageDialog({ packageData }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [updatePackage, { isLoading }] = useUpdatePackageMutation();

    const form = useForm<EditPackageFormValues>({
        resolver: zodResolver(editPackageSchema),
        mode: "onSubmit",
        defaultValues: {
            title: packageData.title ?? "",
            description: packageData.description ?? "",
            originalPrice: Number(packageData.originalPrice) ?? 0,
            discountPrice: Number(packageData.discountPrice) ?? 0,
            freeUsageDays: packageData.freeUsageDays ?? 0,
            freeDisplayMinutes: packageData.freeDisplayMinutes ?? 0,
            freeDownloadMinutes: packageData.freeDownloadMinutes ?? 0,
            usageDays: packageData.usageDays ?? 0,
            displayMinutes: packageData.displayMinutes ?? 0,
            downloadMinutes: packageData.downloadMinutes ?? 0,
        },
    });

    /* =========================
         Submit
    ========================== */
    const onSubmit = async (values: EditPackageFormValues) => {
        // تبدیل مقادیر قیمت به number مطمئن
        const payload: UpdatePackageDto = {
            ...values,
            originalPrice: Number(values.originalPrice),
            discountPrice: Number(values.discountPrice),
            freeUsageDays: values.freeUsageDays ?? undefined,
            freeDisplayMinutes: values.freeDisplayMinutes ?? undefined,
            freeDownloadMinutes: values.freeDownloadMinutes ?? undefined,
            usageDays: values.usageDays ?? undefined,
            displayMinutes: values.displayMinutes ?? undefined,
            downloadMinutes: values.downloadMinutes ?? undefined,
        };


        try {
            await updatePackage({ id: packageData.id, body: payload }).unwrap();
            toast.success("اطلاعات پکیج با موفقیت ویرایش شد");
            setOpen(false);
        } catch (err: any) {
            if (err?.status === 400) toast.error("داده‌های ورودی نامعتبر است");
            else toast.error("خطا در ویرایش پکیج");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    {t("edit")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("editPackage")}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4"
                >
                    {/* Title */}
                    <div>
                        <Label className="mb-1">{t("title")}</Label>
                        <Input {...form.register("title")} />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                        <Label className="mb-1">{t("description")}</Label>
                        <Input {...form.register("description")} />
                    </div>

                    {/* Original Price */}
                    <div>
                        <Label className="mb-1">{t("originalPrice")}</Label>
                        <Controller
                            control={form.control}
                            name="originalPrice"
                            render={({ field }) => (
                                <Input
                                    inputMode="numeric"
                                    value={formatNumber(field.value)}
                                    onChange={(e) => {
                                        const raw = parseNumber(e.target.value);
                                        field.onChange(raw === "" ? 0 : Number(raw));
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Discount Price */}
                    <div>
                        <Label className="mb-1">{t("discountPrice")}</Label>
                        <Controller
                            control={form.control}
                            name="discountPrice"
                            render={({ field }) => (
                                <Input
                                    inputMode="numeric"
                                    value={formatNumber(field.value)}
                                    onChange={(e) => {
                                        const raw = parseNumber(e.target.value);
                                        field.onChange(raw === "" ? 0 : Number(raw));
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Free Usage Days */}
                    <div>
                        <Label className="mb-1">{t("freeUsageDays")}</Label>
                        <Input
                            type="number"
                            defaultValue={packageData.freeUsageDays ?? 0}
                            {...form.register("freeUsageDays", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Free Display Minutes */}
                    <div>
                        <Label className="mb-1">{t("freeDisplayMinutes")}</Label>
                        <Input
                            type="number"
                            defaultValue={packageData.freeDisplayMinutes ?? 0}
                            {...form.register("freeDisplayMinutes", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Free Download Minutes */}
                    <div>
                        <Label className="mb-1">{t("freeDownloadMinutes")}</Label>
                        <Input
                            type="number"
                            defaultValue={packageData.freeDownloadMinutes ?? 0}
                            {...form.register("freeDownloadMinutes", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Usage Days */}
                    <div>
                        <Label className="mb-1">{t("usageDays")}</Label>
                        <Input
                            type="number"
                            defaultValue={packageData.usageDays ?? 0}
                            {...form.register("usageDays", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Display Minutes */}
                    <div>
                        <Label className="mb-1">{t("displayMinutes")}</Label>
                        <Input
                            type="number"
                            defaultValue={packageData.displayMinutes ?? 0}
                            {...form.register("displayMinutes", { valueAsNumber: true })}
                        />
                    </div>

                    {/* Download Minutes */}
                    <div>
                        <Label className="mb-1">{t("downloadMinutes")}</Label>
                        <Input
                            type="number"
                            defaultValue={packageData.downloadMinutes ?? 0}
                            {...form.register("downloadMinutes", { valueAsNumber: true })}
                        />
                    </div>

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
