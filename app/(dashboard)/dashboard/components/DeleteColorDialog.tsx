"use client";

import * as React from "react";
import { Color } from "@/types/color";
import { useDeleteColorMutation } from "@/services/api/colorsApi";
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
    colorData: Color;
}

export function DeleteColorDialog({ colorData }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [deleteColor, { isLoading }] = useDeleteColorMutation();

    const handleDelete = async () => {
        try {
            await deleteColor(colorData.id).unwrap();

            toast.success(t("colorDeleted"));
            setOpen(false);
        } catch (err: any) {
            const status = err?.status;

            if (status === 400) toast.error(t("defaultColorCannotDelete"));
            else if (status === 401) toast.error(t("loginRequired"));
            else if (status === 403) toast.error(t("adminOnly"));
            else if (status === 404) toast.error(t("colorNotFound"));
            else toast.error(t("deleteError"));
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
                        className={isRtl ? "text-right" : "text-left"}
                    >
                        {t("deleteColorConfirm", {
                            title: colorData.title,
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
                        {isLoading ? t("deleting") : t("delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}