"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAdminChangePasswordMutation } from "@/services/api/usersApi";

interface Props {
    userId: string;
}

export function AdminChangePasswordDialog({ userId }: Props) {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [changePassword, { isLoading }] =
        useAdminChangePasswordMutation();

    const onSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error(t("passwordRequired"));
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(t("passwordsNotMatch"));
            return;
        }

        try {
            await changePassword({
                userId,
                newPassword,
                confirmPassword,
            }).unwrap();

            toast.success(t("passwordChangedSuccessfully"));
            setOpen(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            toast.error(err?.data?.message || t("passwordChangeFailed"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    {t("changePassword")}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader className={isRtl ? "!text-right" : ""}>
                    <DialogTitle>{t("changeUserPassword")}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>{t("newPassword")}</Label>
                        <div className="relative">
                            <Input
                                type={show ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={locale === "fa" ? "pl-10" : "pr-10"}
                            />
                            <button
                                type="button"
                                onClick={() => setShow(p => !p)}
                                className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                                    locale === "fa" ? "left-2" : "right-2"
                                }`}
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>{t("confirmPassword")}</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button onClick={onSubmit} disabled={isLoading}>
                        {t("save")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
