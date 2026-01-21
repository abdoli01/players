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

import { useGetPlayersQuery, useSetPlayerIdMutation } from "@/services/api/playersApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

// ----------------------
// Validation schema
// ----------------------
const schema = z.object({
    player: z.string().min(1, "انتخاب الزامی"),
});

type FormValues = z.infer<typeof schema>;

export default function AssignPlayerStep() {
    const t = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { player: "" },
    });

    // Fetch players
    const { data: players = [], isLoading } = useGetPlayersQuery();

    // Mutation
    const [setPlayerId, { isLoading: isSetting }] = useSetPlayerIdMutation();

    // Modal state
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [selectedPlayer, setSelectedPlayer] = React.useState<string | null>(null);

    // Helper: Get display name based on locale
    const getDisplayName = (player: any) => {
        return locale === "fa"
            ? player.fullName
            : player.fullNameEn || player.fullName;
    };

    // Handle form submit: open modal
    const onSubmit = (values: FormValues) => {
        setSelectedPlayer(values.player);
        setOpenConfirm(true);
    };

    // Handle confirm modal
    const handleConfirm = async () => {
        if (!selectedPlayer) return;

        try {
            await setPlayerId({ playerId: selectedPlayer }).unwrap();
            setOpenConfirm(false);
            sessionStorage.removeItem("auth_wizard_state");
            router.push("/"); // بعد از موفقیت
        } catch (err) {
            console.error(err);
            alert(t("Common.errorOccurred")); // میشه بعداً Toast بذاریم
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    disabled={isLoading || players.length === 0 || isSetting}
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
                    <Button className="w-full" disabled={isSetting}>
                        {t("Common.submit")}
                    </Button>
                </form>
            </Form>

            {/* Confirmation Modal */}
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent>
                    <DialogHeader className={isRtl ? "!text-right" : ""}>
                        <DialogTitle>{t("Auth.confirmAssignPlayer")}</DialogTitle>
                    </DialogHeader>
                    <p className="py-2 text-sm">
                        {t("Auth.confirmAssignPlayerMessage")}
                    </p>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                            {t("Common.cancel")}
                        </Button>
                        <Button onClick={handleConfirm} disabled={isSetting}>
                            {t("Common.confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
