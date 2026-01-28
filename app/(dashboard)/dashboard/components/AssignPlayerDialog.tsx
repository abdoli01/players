"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";
import { Check, ChevronsUpDown } from "lucide-react";

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
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { useSearchPlayersQuery } from "@/services/api/playersApi";
import { useAdminSetPlayerIdMutation } from "@/services/api/usersApi";

/* ---------------- schema ---------------- */
const schema = z.object({
    playerId: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

interface AssignPlayerDialogProps {
    userId: string;
    currentPlayerId?: string | null;
}

export function AssignPlayerDialog({
                                       userId,
                                       currentPlayerId,
                                   }: AssignPlayerDialogProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
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
        defaultValues: {
            playerId: currentPlayerId ?? "",
        },
    });

    /* ---------------- api ---------------- */
    const { data: players = [], isFetching } = useSearchPlayersQuery(
        { q: debouncedSearch },
        { skip: !debouncedSearch }
    );

    const [adminSetPlayerId, { isLoading }] =
        useAdminSetPlayerIdMutation();

    const getLabel = (p: any) =>
        locale === "fa" ? p.fullName : p.fullNameEn || p.fullName;

    /* ---------------- submit ---------------- */
    const onSubmit = async (data: FormValues) => {
        try {
            await adminSetPlayerId({
                userId,
                playerId: data.playerId,
            }).unwrap();

            toast.success(t("Common.successAction"));
            setOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || t("Common.errorAction"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    {t("Auth.assignPlayer")}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("Auth.assignPlayer")}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="playerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("Auth.selectPlayer")}
                                    </FormLabel>

                                    <Popover
                                        open={comboOpen}
                                        onOpenChange={setComboOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between"
                                                >
                                                    {field.value
                                                        ? players.find(
                                                            (p) =>
                                                                p.id ===
                                                                field.value
                                                        )?.fullName ??
                                                        t(
                                                            "Auth.selectPlayer"
                                                        )
                                                        : t(
                                                            "Auth.selectPlayer"
                                                        )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-full p-0">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder={t(
                                                        "Common.search"
                                                    )}
                                                    value={search}
                                                    onValueChange={setSearch}
                                                />
                                                <CommandList>
                                                    {isFetching && (
                                                        <CommandEmpty>
                                                            {t(
                                                                "Common.loading"
                                                            )}
                                                        </CommandEmpty>
                                                    )}

                                                    {!isFetching &&
                                                        players.length ===
                                                        0 && (
                                                            <CommandEmpty>
                                                                {t(
                                                                    "Common.noResults"
                                                                )}
                                                            </CommandEmpty>
                                                        )}

                                                    <CommandGroup>
                                                        {players.map(
                                                            (player) => (
                                                                <CommandItem
                                                                    key={
                                                                        player.id
                                                                    }
                                                                    value={
                                                                        player.id
                                                                    }
                                                                    onSelect={() => {
                                                                        field.onChange(
                                                                            player.id
                                                                        );
                                                                        setComboOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value ===
                                                                            player.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {getLabel(
                                                                        player
                                                                    )}
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                            >
                                {t("Common.submit")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
