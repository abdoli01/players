"use client";

import * as React from "react";
import { useCreateTransactionLabelMutation } from "@/services/api/transactionLabelsApi";
import { CreateTransactionLabelDto } from "@/types/transactionLabel";

import { useForm, Controller } from "react-hook-form";
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

const createTransactionLabelSchema = z.object({
    key: z.string().min(1, "Key is required"),
    items: z.array(z.string()).min(1, "At least one item is required"),
    query: z.string().min(1, "Query is required"),
});

type CreateTransactionLabelFormValues = z.infer<
    typeof createTransactionLabelSchema
>;

/* =========================
   Component
========================= */

export function CreateTransactionLabelDialog() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);

    const [createTransactionLabel, { isLoading }] =
        useCreateTransactionLabelMutation();

    const form = useForm<CreateTransactionLabelFormValues>({
        resolver: zodResolver(createTransactionLabelSchema),
        mode: "onSubmit",
        defaultValues: {
            key: "",
            items: [],
            query: "",
        },
    });

    /* =========================
       Submit
    ========================== */

    const onSubmit = async (
        values: CreateTransactionLabelFormValues
    ) => {
        try {
            const payload: CreateTransactionLabelDto = {
                ...values,
            };

            await createTransactionLabel(payload).unwrap();

            toast.success(t("transactionLabelCreatedSuccessfully"));

            setOpen(false);
            form.reset();
        } catch (err: any) {
            const status = err?.status;

            if (status === 400) {
                toast.error(t("invalidInput"));
            } else if (status === 401) {
                toast.error(t("needLoginAgain"));
            } else {
                toast.error(t("unexpectedError"));
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    {t("createTransactionLabel")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader
                    className={isRtl ? "!text-right" : ""}
                >
                    <DialogTitle>
                        {t("createTransactionLabel")}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                >
                    {/* KEY */}

                    <div>
                        <Label className="mb-1.5">
                            {t("key")}
                        </Label>

                        <Input
                            {...form.register("key")}
                            placeholder="attack"
                        />

                        {form.formState.errors.key && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.key.message}
                            </p>
                        )}
                    </div>

                    {/* ITEMS */}

                    <div>
                        <Label className="mb-1.5">
                            {t("items")}
                        </Label>

                        <Controller
                            control={form.control}
                            name="items"
                            render={({ field }) => (
                                <Input
                                    placeholder="attackingPass, passWon, ..."
                                    value={field.value.join(", ")}
                                    onChange={(e) => {
                                        const value =
                                            e.target.value
                                                .split(",")
                                                .map((item) =>
                                                    item.trim()
                                                )
                                                .filter(Boolean);

                                        field.onChange(value);
                                    }}
                                />
                            )}
                        />

                        {form.formState.errors.items && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.items.message}
                            </p>
                        )}
                    </div>

                    {/* QUERY */}

                    <div>
                        <Label className="mb-1.5">
                            {t("query")}
                        </Label>

                        <Input
                            {...form.register("query")}
                            placeholder="event_id = 1 and ..."
                        />

                        {form.formState.errors.query && (
                            <p className="text-red-500 text-sm mt-1">
                                {form.formState.errors.query.message}
                            </p>
                        )}
                    </div>

                    {/* FOOTER */}

                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <DialogClose
                            type="button"
                            className="px-4 py-2 bg-muted rounded"
                        >
                            {t("cancel")}
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? t("saving")
                                : t("save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}