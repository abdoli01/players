"use client";

import * as React from "react";
import { Club } from "@/types/club";
import { useDeleteClubMutation } from "@/services/api/clubsApi";
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
    clubData: Club;
}

export function DeleteClubDialog({ clubData }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = React.useState(false);
    const [deleteClub, { isLoading }] = useDeleteClubMutation();

    const handleDelete = async () => {
        try {
            await deleteClub(clubData.id).unwrap();
            toast.success(t("clubDeleted")); // پیام موفقیت
            setOpen(false);
        } catch (err: any) {
            toast.error(t("deleteError")); // پیام خطا
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-red-500">
                    {t("delete")}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className={isRtl ? "text-right" : "text-left"}>
                        {t("deleteConfirm", { title: clubData.fullName })}
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
