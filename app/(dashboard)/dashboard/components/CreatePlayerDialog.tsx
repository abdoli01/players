"use client";

import * as React from "react";
import { useCreatePlayerMutation } from "@/services/api/playersApi";
import { CreatePlayerDto } from "@/types/player";

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

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

/* =========================
   Zod Schema
========================= */
const createPlayerSchema = z.object({
    fullName: z.string().min(1, "نام کامل الزامی است"),
    shortName: z.string().optional(),
    fullNameEn: z.string().optional(),
    shortNameEn: z.string().optional(),
    nationalId: z
        .string()
        .length(10, "کد ملی باید ۱۰ رقم باشد")
        .optional()
        .or(z.literal("")),
    passportId: z.string().optional(),
    birthday: z.date().nullable().optional(),
    height: z
        .number()
        .min(50, "قد نامعتبر است")
        .max(300, "قد نامعتبر است")
        .optional(),
    corePlayerId: z.number().optional(),
    image: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
});

type CreatePlayerFormValues = z.infer<typeof createPlayerSchema>;

/* =========================
   Component
========================= */
export function CreatePlayerDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [createPlayer, { isLoading }] = useCreatePlayerMutation();

    const form = useForm<CreatePlayerFormValues>({
        resolver: zodResolver(createPlayerSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: "",
            shortName: "",
            fullNameEn: "",
            shortNameEn: "",
            nationalId: "",
            passportId: "",
            birthday: null,
            height: undefined,
            corePlayerId: undefined,
            image: "",
        },
    });

    /* =========================
       Submit
    ========================= */
    const onSubmit = async (values: CreatePlayerFormValues) => {
        try {
            const payload: CreatePlayerDto = {
                ...values,
                birthday: values.birthday
                    ? values.birthday.toISOString().slice(0, 10) // YYYY-MM-DD
                    : undefined,
            };

            await createPlayer(payload).unwrap();

            toast.success("بازیکن با موفقیت ایجاد شد");
            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;
            if (status === 400) toast.error("اطلاعات وارد شده نامعتبر است");
            else if (status === 401) toast.error("نیاز به ورود مجدد");
            else toast.error("خطای غیرمنتظره‌ای رخ داد");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("createPlayer")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("createPlayer")}</DialogTitle>
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

                    {/* National ID */}
                    <div>
                        <Label className="mb-1">{t("nationalId")}</Label>
                        <Input {...form.register("nationalId")} />
                        {form.formState.errors.nationalId && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.nationalId.message}
                            </p>
                        )}
                    </div>

                    {/* Passport */}
                    <div>
                        <Label className="mb-1">{t("passportId")}</Label>
                        <Input {...form.register("passportId")} />
                    </div>

                    {/* Birthday - Persian DatePicker */}
                    <div>
                        <Label className="mb-1">{t("birthday")}</Label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={form.watch("birthday")}
                            onChange={(date) =>
                                form.setValue(
                                    "birthday",
                                    date ? date.toDate() : null
                                )
                            }
                            format="YYYY/MM/DD"
                            calendarPosition="bottom-right"
                            editable={false}
                            className="bg-background text-foreground w-full"
                            inputClass="w-full h-10 px-3 rounded border border-gray-300 text-foreground"
                            placeholder="تاریخ تولد"
                        />
                        {form.formState.errors.birthday && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.birthday.message}
                            </p>
                        )}
                    </div>

                    {/* Height */}
                    <div>
                        <Label className="mb-1">{t("height")}</Label>
                        <Input
                            type="number"
                            onChange={(e) =>
                                form.setValue(
                                    "height",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                )
                            }
                        />
                        {form.formState.errors.height && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.height.message}
                            </p>
                        )}
                    </div>

                    {/* Core Player ID */}
                    <div>
                        <Label className="mb-1">{t("corePlayerId")}</Label>
                        <Input
                            type="number"
                            onChange={(e) =>
                                form.setValue(
                                    "corePlayerId",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                )
                            }
                        />
                    </div>

                    {/* Image */}
                    <div className="col-span-2">
                        <Label className="mb-1">{t("image")}</Label>
                        <Input {...form.register("image")} />
                        {form.formState.errors.image && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.image.message}
                            </p>
                        )}
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
