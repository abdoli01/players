"use client";

import * as React from "react";
import { useCreateClubMutation } from "@/services/api/clubsApi";
import { CreateClubDto } from "@/types/club";

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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

/* =========================
   Zod Schema
========================= */
const createClubSchema = z.object({
    fullName: z.string().min(1, "نام کامل باشگاه الزامی است"),
    shortName: z.string().optional(),
    fullNameEn: z.string().optional(),
    shortNameEn: z.string().optional(),
    isNational: z.boolean(), // حتماً boolean
    image: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
            message: "آدرس تصویر معتبر نیست",
        }),
    image50: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
            message: "آدرس تصویر 50x50 معتبر نیست",
        }),
    image26: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
            message: "آدرس تصویر 26x26 معتبر نیست",
        }),
});

type CreateClubFormValues = z.infer<typeof createClubSchema>;

/* =========================
   Component
========================= */
export function CreateClubDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [createClub, { isLoading }] = useCreateClubMutation();

    const form = useForm<CreateClubFormValues>({
        resolver: zodResolver(createClubSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: "",
            shortName: "",
            fullNameEn: "",
            shortNameEn: "",
            isNational: false, // مقدار پیشفرض boolean
            image: "",
            image50: "",
            image26: "",
        },
    });

    /* =========================
       Submit
    ========================= */
    const onSubmit = async (values: CreateClubFormValues) => {
        try {
            const payload: CreateClubDto = values;
            await createClub(payload).unwrap();

            toast.success(t("clubCreated"));
            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;
            if (status === 400) toast.error(t("invalidData"));
            else if (status === 401) toast.error(t("loginRequired"));
            else toast.error(t("unexpectedError"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("createClub")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("createClub")}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4"
                >
                    {/* Full Name */}
                    <div>
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

                    {/* Full Name EN */}
                    <div>
                        <Label className="mb-1">{t("fullNameEn")}</Label>
                        <Input {...form.register("fullNameEn")} />
                    </div>

                    {/* Short Name EN */}
                    <div>
                        <Label className="mb-1">{t("shortNameEn")}</Label>
                        <Input {...form.register("shortNameEn")} />
                    </div>

                    {/* isNational */}
                    <div>
                        <Label className="mb-1">{t("isNational")}</Label>
                        <Select
                            value={form.watch("isNational") ? "true" : "false"}
                            onValueChange={(value) =>
                                form.setValue("isNational", value === "true")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t("isNational")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">{t("yes")}</SelectItem>
                                <SelectItem value="false">{t("no")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Image */}
                    <div className="col-span-2">
                        <Label className="mb-1">{t("image")}</Label>
                        <Input {...form.register("image")} />
                    </div>

                    {/* Image50 */}
                    <div>
                        <Label className="mb-1">{t("image50")}</Label>
                        <Input {...form.register("image50")} />
                    </div>

                    {/* Image26 */}
                    <div>
                        <Label className="mb-1">{t("image26")}</Label>
                        <Input {...form.register("image26")} />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="col-span-2 mt-4 flex justify-end gap-2">
                        <DialogClose type="button" className="px-4 py-2 bg-muted rounded">
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
