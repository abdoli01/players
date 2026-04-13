"use client";

import * as React from "react";
import {
    useGetDefaultColorQuery,
    useUpdateDefaultColorMutation,
} from "@/services/api/colorsApi";
import { UpdateColorDto } from "@/types/color";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";

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
import { Spinner } from "@/components/Spinner";

export function EditDefaultColorButton() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);

    const { data, isLoading } = useGetDefaultColorQuery();
    const [updateDefaultColor, { isLoading: isSaving }] =
        useUpdateDefaultColorMutation();

    const schema = React.useMemo(
        () =>
            z.object({
                title: z.string().min(1, t("colorTitleRequired")),
                H1: z.string().min(1, t("H1Required")),
                H2: z.string().optional(),
                G1: z.string().optional(),
                G2: z.string().optional(),
                HG3: z.string().optional(),
                HG4: z.string().optional(),
                ACN1: z.string().optional(),
                ACN2: z.string().optional(),
            }),
        [t]
    );

    type FormValues = z.infer<typeof schema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        values: {
            title: data?.title ?? "",
            H1: data?.H1 ?? "",
            H2: data?.H2 ?? "",
            G1: data?.G1 ?? "",
            G2: data?.G2 ?? "",
            HG3: data?.HG3 ?? "",
            HG4: data?.HG4 ?? "",
            ACN1: data?.ACN1 ?? "",
            ACN2: data?.ACN2 ?? "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const payload: UpdateColorDto = { ...values };

            await updateDefaultColor(payload).unwrap();

            toast.success(t("colorUpdated"));
            setOpen(false);
        } catch (err: any) {
            const status = err?.status;

            if (status === 400) toast.error(t("invalidInput"));
            else if (status === 401) toast.error(t("loginRequired"));
            else if (status === 403) toast.error(t("adminOnly"));
            else if (status === 404) toast.error(t("colorNotFound"));
            else toast.error(t("updateError"));
        }
    };

    const fields = [
        "H1",
        "H2",
        "G1",
        "G2",
        "HG3",
        "HG4",
        "ACN1",
        "ACN2",
    ] as const;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {t("editDefaultColor")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>
                        {t("editDefaultColor")}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <Spinner />
                ) : (
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-2 gap-4 py-4"
                    >
                        <div className="col-span-2">
                            <Label className="mb-1.5">{t("title")}</Label>
                            <Input {...form.register("title")} />
                        </div>

                        {fields.map((field) => (
                            <div key={field}>
                                <Label className="mb-1.5">{t(field)}</Label>
                                <Input
                                    placeholder="oklch(0.6 0.15 250)"
                                    {...form.register(field)}
                                />
                            </div>
                        ))}

                        <DialogFooter className="col-span-2 mt-4 flex justify-end gap-2">
                            <DialogClose className="px-4 py-2 bg-muted rounded">
                                {t("cancel")}
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? t("saving")
                                    : t("save")}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}