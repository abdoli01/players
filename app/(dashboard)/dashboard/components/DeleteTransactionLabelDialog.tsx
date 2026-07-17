"use client";

import * as React from "react";
import { TransactionLabel } from "@/types/transactionLabel";
import { useDeleteTransactionLabelMutation } from "@/services/api/transactionLabelsApi";
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

interface Props {
    transactionLabel: TransactionLabel;
}

export function DeleteTransactionLabelDialog({
                                                 transactionLabel,
                                             }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);

    const [deleteTransactionLabel, { isLoading }] =
        useDeleteTransactionLabelMutation();

    const handleDelete = async () => {
        try {
            await deleteTransactionLabel(
                transactionLabel.id
            ).unwrap();

            toast.success(
                t("transactionLabelDeleted")
            );

            setOpen(false);
        } catch (err) {
            toast.error(t("deleteError"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500"
                >
                    {t("delete")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle
                        className={
                            isRtl
                                ? "text-right"
                                : "text-left"
                        }
                    >
                        {t("deleteTransactionLabelConfirm", {
                            key: transactionLabel.key,
                        })}
                    </DialogTitle>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <DialogClose className="px-4 py-2 bg-muted rounded">
                        {t("cancel")}
                    </DialogClose>

                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("deleting")
                            : t("delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}