"use client";

import * as React from "react";
import { useCreatePlayerClubMutation } from "@/services/api/playerClubsApi";
import { CreatePlayerClubDto } from "@/types/playerClub";

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
const createPlayerClubSchema = z.object({
    playerId: z.string().uuid("شناسه بازیکن معتبر نیست"),
    clubId: z.string().uuid("شناسه باشگاه معتبر نیست"),
    sportId: z.string().uuid("شناسه ورزش معتبر نیست"),
    startDate: z
        .any()
        .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
            message: "تاریخ شروع معتبر نیست",
        }),
    endDate: z
        .any()
        .optional()
        .refine((val) => val === undefined || (val instanceof Date && !isNaN(val.getTime())), {
            message: "تاریخ پایان معتبر نیست",
        }),
});

type CreatePlayerClubFormValues = z.infer<typeof createPlayerClubSchema>;

/* =========================
   Helper for TS-safe error rendering
========================= */
function renderError(error: unknown) {
    if (!error) return null;
    const fieldError = error as { message?: unknown };
    if (typeof fieldError.message === "string") return fieldError.message;
    return null;
}

/* =========================
   Component
========================= */
export function CreatePlayerClubDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [createPlayerClub, { isLoading }] = useCreatePlayerClubMutation();

    const form = useForm<CreatePlayerClubFormValues>({
        resolver: zodResolver(createPlayerClubSchema),
        mode: "onSubmit",
        defaultValues: {
            playerId: "",
            clubId: "",
            sportId: "",
            startDate: new Date(),
            endDate: undefined,
        },
    });

    /* =========================
       Submit
    ========================== */
    const onSubmit = async (values: CreatePlayerClubFormValues) => {
        try {
            const payload: CreatePlayerClubDto = {
                playerId: values.playerId,
                clubId: values.clubId,
                sportId: values.sportId,
                startDate: values.startDate.toISOString().slice(0, 10),
                endDate: values.endDate ? values.endDate.toISOString().slice(0, 10) : undefined,
            };

            await createPlayerClub(payload).unwrap();

            toast.success("رابطه بازیکن-باشگاه با موفقیت ایجاد شد");
            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;
            if (status === 400) toast.error("اطلاعات وارد شده نامعتبر است");
            else if (status === 401) toast.error("نیاز به ورود مجدد");
            else if (status === 403) toast.error("فقط مدیران می‌توانند این عملیات را انجام دهند");
            else toast.error("خطای غیرمنتظره‌ای رخ داد");
        }
    };

    /* =========================
       Render
    ========================== */
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("createPlayerClub")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("createPlayerClub")}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4"
                >
                    {/* Player ID */}
                    <div>
                        <Label className="mb-1">{t("playerId")}</Label>
                        <Input {...form.register("playerId")} placeholder="UUID بازیکن" />
                        {renderError(form.formState.errors.playerId) && (
                            <p className="text-sm text-red-500 mt-1">
                                {renderError(form.formState.errors.playerId)}
                            </p>
                        )}
                    </div>

                    {/* Club ID */}
                    <div>
                        <Label className="mb-1">{t("clubId")}</Label>
                        <Input {...form.register("clubId")} placeholder="UUID باشگاه" />
                        {renderError(form.formState.errors.clubId) && (
                            <p className="text-sm text-red-500 mt-1">
                                {renderError(form.formState.errors.clubId)}
                            </p>
                        )}
                    </div>

                    {/* Sport ID */}
                    <div>
                        <Label className="mb-1">{t("sportId")}</Label>
                        <Input {...form.register("sportId")} placeholder="UUID ورزش" />
                        {renderError(form.formState.errors.sportId) && (
                            <p className="text-sm text-red-500 mt-1">
                                {renderError(form.formState.errors.sportId)}
                            </p>
                        )}
                    </div>

                    {/* Start Date */}
                    <div>
                        <Label className="mb-1">{t("startDate")}</Label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={form.watch("startDate")}
                            onChange={(date) =>
                                form.setValue("startDate", date instanceof Date ? date : date?.toDate() || new Date())
                            }
                            format="YYYY/MM/DD"
                            editable
                            inputClass="w-full h-10 px-3 rounded border border-gray-300 text-foreground"
                            calendarPosition="bottom-right"
                        />
                        {renderError(form.formState.errors.startDate) && (
                            <p className="text-sm text-red-500 mt-1">
                                {renderError(form.formState.errors.startDate)}
                            </p>
                        )}
                    </div>

                    {/* End Date */}
                    <div>
                        <Label className="mb-1">{t("endDate")}</Label>
                        <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={form.watch("endDate")}
                            onChange={(date) =>
                                form.setValue("endDate", date instanceof Date ? date : date?.toDate() || undefined)
                            }
                            format="YYYY/MM/DD"
                            editable
                            inputClass="w-full h-10 px-3 rounded border border-gray-300 text-foreground"
                            calendarPosition="bottom-right"
                            placeholder="اختیاری"
                        />
                        {renderError(form.formState.errors.endDate) && (
                            <p className="text-sm text-red-500 mt-1">
                                {renderError(form.formState.errors.endDate)}
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
