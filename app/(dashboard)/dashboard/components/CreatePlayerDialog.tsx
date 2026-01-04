"use client";

import * as React from "react";
import { useCreatePlayerMutation } from "@/services/api/playersApi";
import { CreatePlayerDto } from "@/types/player";
import { useTranslations } from "next-intl";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreatePlayerDialog() {
    const t = useTranslations("Dashboard");
    const [open, setOpen] = React.useState(false);

    const [createPlayer, { isLoading }] = useCreatePlayerMutation();

    const [form, setForm] = React.useState<CreatePlayerDto>({
        fullName: "",
        shortName: "",
        fullNameEn: "",
        shortNameEn: "",
        nationalId: "",
        passportId: "",
        birthday: "",
        countryId: undefined,
        height: undefined,
        corePlayerId: undefined,
        image: "",
    });

    const onChange = (key: keyof CreatePlayerDto, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = async () => {
        try {
            await createPlayer(form).unwrap();
            setOpen(false);
            setForm({
                fullName: "",
                shortName: "",
                fullNameEn: "",
                shortNameEn: "",
                nationalId: "",
                passportId: "",
                birthday: "",
                countryId: undefined,
                height: undefined,
                corePlayerId: undefined,
                image: "",
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("createPlayer")}</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t("createPlayer")}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <Label className="mb-1">{t("fullName")}</Label>
                        <Input
                            value={form.fullName}
                            onChange={(e) =>
                                onChange("fullName", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("shortName")}</Label>
                        <Input
                            value={form.shortName}
                            onChange={(e) =>
                                onChange("shortName", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("fullNameEn")}</Label>
                        <Input
                            value={form.fullNameEn}
                            onChange={(e) =>
                                onChange("fullNameEn", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("shortNameEn")}</Label>
                        <Input
                            value={form.shortNameEn}
                            onChange={(e) =>
                                onChange("shortNameEn", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("nationalId")}</Label>
                        <Input
                            value={form.nationalId}
                            onChange={(e) =>
                                onChange("nationalId", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("passportId")}</Label>
                        <Input
                            value={form.passportId}
                            onChange={(e) =>
                                onChange("passportId", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("birthday")}</Label>
                        <Input
                            type="date"
                            value={form.birthday}
                            onChange={(e) =>
                                onChange("birthday", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("height")}</Label>
                        <Input
                            type="number"
                            value={form.height ?? ""}
                            onChange={(e) =>
                                onChange(
                                    "height",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                )
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-1">{t("corePlayerId")}</Label>
                        <Input
                            type="number"
                            value={form.corePlayerId ?? ""}
                            onChange={(e) =>
                                onChange(
                                    "corePlayerId",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                )
                            }
                        />
                    </div>

                    <div className="col-span-2">
                        <Label className="mb-1">{t("image")}</Label>
                        <Input
                            value={form.image}
                            onChange={(e) =>
                                onChange("image", e.target.value)
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading || !form.fullName}
                    >
                        {t("save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
