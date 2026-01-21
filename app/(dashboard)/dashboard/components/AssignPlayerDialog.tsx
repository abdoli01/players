"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useGetPlayersQuery } from "@/services/api/playersApi";
import { useAdminSetPlayerIdMutation } from "@/services/api/playersApi";

// ----------------------
// تایپ‌ها و Schema
// ----------------------
interface AssignPlayerDialogProps {
    userId: string;
    currentPlayerId?: string | null;
}

const schema = z.object({
    player: z.string().min(1, "انتخاب الزامی"),
});

type FormValues = z.infer<typeof schema>;

// ----------------------
// کامپوننت
// ----------------------
export function AssignPlayerDialog({ userId, currentPlayerId }: AssignPlayerDialogProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { player: currentPlayerId || "" },
    });

    // ----------------------
    // گرفتن لیست پلیرها
    // ----------------------
    const { data: players = [], isLoading } = useGetPlayersQuery();

    const [adminSetPlayerId, { isLoading: isSubmitting }] = useAdminSetPlayerIdMutation();

    // ----------------------
    // Helper: نمایش نام بازیکن بر اساس زبان
    // ----------------------
    const getDisplayName = (player: any) => {
        return locale === "fa"
            ? player.fullName
            : player.fullNameEn || player.fullName;
    };

    // ----------------------
    // Submit فرم
    // ----------------------
    const onSubmit = async (data: FormValues, close: () => void) => {
        try {
            await adminSetPlayerId({
                userId,
                playerId: data.player,
            }).unwrap();

            toast.success(t("Common.successAction")); // پیام موفقیت
            close(); // بستن دیالوگ
        } catch (err: any) {
            toast.error(err?.data?.message || t("Common.errorAction")); // پیام خطا
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    {t("Auth.assignPlayer")}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("Auth.assignPlayer")}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) => onSubmit(values, () => form.reset()))}
                        className="space-y-4"
                    >
                        {/* انتخاب پلیر */}
                        <FormField
                            name="player"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("Auth.selectPlayer")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("Auth.selectPlayer")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoading ? (
                                                <div className="p-2 text-sm text-muted-foreground">
                                                    {t("Common.loading")}...
                                                </div>
                                            ) : players.length > 0 ? (
                                                players.map((player) => (
                                                    <SelectItem key={player.id} value={player.id}>
                                                        {getDisplayName(player)}
                                                        {player.shortName ? ` (${player.shortName})` : ""}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-muted-foreground">
                                                    {t("Common.noPlayers")}
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {t("Common.submit")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
