"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { setUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSearchPlayersQuery } from "@/services/api/playersApi";
import { useSetPlayerIdMutation } from "@/services/api/usersApi";

/* ---------------- schema ---------------- */
const schema = z.object({
    player: z.string().min(1, "انتخاب الزامی"),
});

type FormValues = z.infer<typeof schema>;

export default function AssignPlayerStep() {
    const t = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [selectedPlayer, setSelectedPlayer] = React.useState<string | null>(null);
    const [comboOpen, setComboOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    /* ---------------- debounce ---------------- */
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    React.useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    /* ---------------- form ---------------- */
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { player: "" },
    });

    /* ---------------- api ---------------- */
    const { data: players = [], isFetching } = useSearchPlayersQuery(
        { q: debouncedSearch },
        { skip: !debouncedSearch }
    );

    const [setPlayerId, { isLoading: isSetting }] = useSetPlayerIdMutation();

    const getLabel = (player: any) => locale === "fa" ? player.fullName : player.fullNameEn || player.fullName;

    /* ---------------- submit ---------------- */
    const onSubmit = (values: FormValues) => {
        setSelectedPlayer(values.player);
        setOpenConfirm(true);
    };

    const handleConfirm = async () => {
        if (!selectedPlayer) return;
        try {
            const updatedUser: any = await setPlayerId({ playerId: selectedPlayer }).unwrap();
            dispatch(setUser(updatedUser.user));
            setOpenConfirm(false);
            sessionStorage.removeItem("auth_wizard_state");
            router.push("/");
        } catch (err) {
            console.error(err);
            toast.error(t("Common.errorAction"));
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        name="player"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("Auth.assignPlayer")}</FormLabel>

                                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between"
                                            >
                                                {field.value ? getLabel(players.find(p => p.id === field.value) || { fullName: field.value }) : t("Auth.selectPlayer")}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-full p-0">
                                        <Command shouldFilter={false}>
                                            <CommandInput
                                                placeholder={t("Common.search")}
                                                value={search}
                                                onValueChange={setSearch}
                                            />
                                            <CommandList>
                                                {isFetching && <CommandEmpty>{t("Common.loading")}</CommandEmpty>}
                                                {!isFetching && players.length === 0 && <CommandEmpty>{t("Common.noPlayers")}</CommandEmpty>}
                                                <CommandGroup>
                                                    {players.map(player => (
                                                        <CommandItem
                                                            key={player.id}
                                                            value={player.id}
                                                            onSelect={() => {
                                                                field.onChange(player.id);
                                                                setComboOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", field.value === player.id ? "opacity-100" : "opacity-0")} />
                                                            {getLabel(player)}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isSetting}>
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
                    <p className="py-2 text-sm">{t("Auth.confirmAssignPlayerMessage")}</p>
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
