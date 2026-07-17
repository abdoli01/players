"use client";

import * as React from "react";
import {
    TransactionLabel,
    UpdateTransactionLabelDto,
} from "@/types/transactionLabel";
import { useUpdateTransactionLabelMutation } from "@/services/api/transactionLabelsApi";

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

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

const schema = z.object({
    key: z.string().min(1, "Key is required"),
    items: z.string().min(1, "Items are required"),
    query: z.string().min(1, "Query is required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    transactionLabel: TransactionLabel;
}

export function EditTransactionLabelDialog({
                                               transactionLabel,
                                           }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);

    const [updateTransactionLabel, { isLoading }] =
        useUpdateTransactionLabelMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            key: transactionLabel.key,
            items: transactionLabel.items.join(", "),
            query: transactionLabel.query,
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const payload: UpdateTransactionLabelDto = {
                key: values.key,
                items: values.items
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                query: values.query,
            };

            await updateTransactionLabel({
                id: transactionLabel.id,
                body: payload,
            }).unwrap();

            toast.success(t("transactionLabelUpdated"));

            setOpen(false);
        } catch (err) {
            toast.error(t("updateError"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                >
                    {t("edit")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle
                        className={isRtl ? "text-right" : ""}
                    >
                        {t("editTransactionLabel")}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* KEY */}
                        <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("key")}
                                    </FormLabel>

                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ITEMS */}
                        <FormField
                            control={form.control}
                            name="items"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("items")}
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="item1, item2"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* QUERY */}
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("query")}
                                    </FormLabel>

                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                >
                                    {t("cancel")}
                                </Button>
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
                </Form>
            </DialogContent>
        </Dialog>
    );
}