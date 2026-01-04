"use client";

import * as React from "react";
import { Player, UpdatePlayerDto } from "@/types/player";
import { useUpdatePlayerMutation } from "@/services/api/playersApi";

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
const editPlayerSchema = z.object({
    fullName: z.string().min(1, "نام کامل الزامی است"),
    shortName: z.string().optional(),
    fullNameEn: z.string().optional(),
    shortNameEn: z.string().optional(),
    nationalId: z.string().length(10).optional().or(z.literal("")),
    passportId: z.string().optional(),
    birthday: z.date().nullable().optional(),
    height: z.number().min(50).max(300).optional(),
    corePlayerId: z.number().optional(),
    image: z.string().url().optional().or(z.literal("")),
});

type EditPlayerFormValues = z.infer<typeof editPlayerSchema>;

interface Props {
    player: Player;
}

/* =========================
   Component
========================= */
export function EditPlayerDialog({ player }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();

    const form = useForm<EditPlayerFormValues>({
        resolver: zodResolver(editPlayerSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: player.fullName ?? "",
            shortName: player.shortName ?? "",
            fullNameEn: player.fullNameEn ?? "",
            shortNameEn: player.shortNameEn ?? "",
            nationalId: player.nationalId ?? "",
            passportId: player.passportId ?? "",
            birthday: player.birthday ? new Date(player.birthday) : null,
            height: player.height ?? undefined,
            corePlayerId: player.corePlayerId ?? undefined,
            image: player.image ?? "",
        },
    });

    /* =========================
       Submit
    ========================= */
    const onSubmit = async (values: EditPlayerFormValues) => {
        try {
            const payload: UpdatePlayerDto = {
                ...values,
                birthday: values.birthday
                    ? values.birthday.toISOString().slice(0, 10)
                    : undefined,
            };

            await updatePlayer({
                id: player.id,
                body: payload,
            }).unwrap();

            toast.success("اطلاعات بازیکن با موفقیت ویرایش شد");
            setOpen(false);
        } catch (err: any) {
            if (err?.status === 400) toast.error("اطلاعات وارد شده نامعتبر است");
            else toast.error("خطا در ویرایش بازیکن");
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
                    <DialogTitle>{t("editPlayer")}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4 py-4"
                >
                    {/* Full Name */}
                    <div>
                        <Label className="mb-1">{t("fullName")}</Label>
                        <Input {...form.register("fullName")} />
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
                    </div>

                    {/* Passport */}
                    <div>
                        <Label className="mb-1">{t("passportId")}</Label>
                        <Input {...form.register("passportId")} />
                    </div>

                    {/* Birthday */}
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
                            editable={false}
                            inputClass="w-full h-10 px-3 rounded border"
                        />
                    </div>

                    {/* Height */}
                    <div>
                        <Label className="mb-1">{t("height")}</Label>
                        <Input
                            type="number"
                            defaultValue={player.height}
                            onChange={(e) =>
                                form.setValue(
                                    "height",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                )
                            }
                        />
                    </div>

                    {/* Core Player ID */}
                    <div>
                        <Label className="mb-1">{t("corePlayerId")}</Label>
                        <Input
                            type="number"
                            defaultValue={player.corePlayerId}
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
