"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Filter } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    itemsTree: any[];

    selectedItemsPath: string[];
    setSelectedItemsPath: React.Dispatch<React.SetStateAction<string[]>>;

    onSubmit: () => void;
};

export function VideoFiltersModal({
                                      open,
                                      onOpenChange,
                                      itemsTree,
                                      selectedItemsPath,
                                      setSelectedItemsPath,
                                      onSubmit,
                                  }: Props) {
    const t = useTranslations("Videos");
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // helpers
    // -----------------------
    const getChildren = (level: number) => {
        if (level === 0) return itemsTree;

        let current = itemsTree;

        for (let i = 0; i < level; i++) {
            const key = selectedItemsPath[i];
            const found = current.find((item) => item.key === key);

            if (!found?.items) return [];
            current = found.items;
        }

        return current;
    };

    const handleSelect = (level: number, value: string) => {
        const newPath = [...selectedItemsPath.slice(0, level), value];
        setSelectedItemsPath(newPath);
    };

    // -----------------------
    // render
    // -----------------------
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button className="p-1 border-2 border-acn1 hover:bg-acn1 rounded-md">
                    <Filter size={16} />
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("filters")}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    {Array.from({
                        length: selectedItemsPath.length + 1,
                    }).map((_, level) => {
                        const options = getChildren(level);
                        if (!options.length) return null;

                        return (
                            <Select
                                key={level}
                                value={selectedItemsPath[level] ?? ""}
                                onValueChange={(v) =>
                                    handleSelect(level, v)
                                }
                            >
                                <SelectTrigger
                                    className={isRtl ? "flex-row-reverse" : ""}
                                >
                                    <SelectValue placeholder={t("select")} />
                                </SelectTrigger>

                                <SelectContent>
                                    {options.map((item) => (
                                        <SelectItem
                                            key={item.key}
                                            value={item.key}
                                        >
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    })}

                    <Button onClick={onSubmit}>
                        {t("getVideos")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}