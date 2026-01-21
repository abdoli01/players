"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
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

// ----------------------
// Validation schema
// ----------------------
const schema = z.object({
    player: z.string().min(1, "انتخاب الزامی"),
});

type FormValues = z.infer<typeof schema>;

// ----------------------
// Component
// ----------------------
export default function AssignPlayerStep() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { player: "" },
    });

    // Fetch players
    const { data: players = [], isLoading } = useGetPlayersQuery();

    // Helper: Get display name based on locale
    const getDisplayName = (player: any) => {
        return locale === "fa"
            ? player.fullName
            : player.fullNameEn || player.fullName;
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => {
                    // Clear wizard state and navigate
                    sessionStorage.removeItem("auth_wizard_state");
                    router.push("/");
                })}
                className="space-y-4"
            >
                {/* Player select */}
                <FormField
                    name="player"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("Auth.assignPlayer")}</FormLabel>

                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isLoading || players.length === 0}
                            >
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

                {/* Submit button */}
                <Button className="w-full">{t("Common.submit")}</Button>
            </form>
        </Form>
    );
}
