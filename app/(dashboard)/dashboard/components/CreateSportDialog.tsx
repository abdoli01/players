"use client";

import * as React from "react";
import { useCreateSportMutation } from "@/services/api/sportsApi";
import { CreateSportDto } from "@/types/sport";

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
const createSportSchema = z.object({
    fullName: z.string().min(1, "نام کامل ورزش الزامی است"),
    shortName: z.string().optional(),
    fullNameEn: z.string().optional(),
    shortNameEn: z.string().optional(),
});

type CreateSportFormValues = z.infer<typeof createSportSchema>;

/* =========================
   Component
========================= */
export function CreateSportDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [createSport, { isLoading }] = useCreateSportMutation();

    const form = useForm<CreateSportFormValues>({
        resolver: zodResolver(createSportSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: "",
            shortName: "",
            fullNameEn: "",
            shortNameEn: "",
        },
    });

    const onSubmit = async (values: CreateSportFormValues) => {
        try {
            const payload: CreateSportDto = values;
            await createSport(payload).unwrap();

            toast.success(t("sportCreated"));
            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;
            if (status === 400) toast.error(t("invalidData"));
            else if (status === 401) toast.error(t("loginRequired"));
            else if (status === 403) toast.error(t("adminOnly"));
            else toast.error(t("unexpectedError"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("createSport")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("createSport")}</DialogTitle>
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
