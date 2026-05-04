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
    const needsFilter = selectedItemsPath.length === 0;

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
                <button
                    className={`
            relative p-1 border-2 border-acn1 rounded-md
            hover:bg-acn1 transition
            ${needsFilter ? "animate-pulse" : ""}
        `}
                >
                    <Filter size={16} />

                    {/* dot indicator */}
                    {needsFilter && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-acn1 animate-bounce" />
                    )}
                </button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-sm sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("filters")}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 w-full">
                    {Array.from({
                        length: selectedItemsPath.length + 1,
                    }).map((_, level) => {
                        const options = getChildren(level);
                        if (!options.length) return null;

                        return (
                            <Select
                                key={level}
                                value={selectedItemsPath[level] ?? ""}
                                onValueChange={(v) => handleSelect(level, v)}
                            >
                                <SelectTrigger
                                    className={`w-full ${isRtl ? "flex-row-reverse" : ""}`}
                                >
                                    <SelectValue placeholder={t("select")} />
                                </SelectTrigger>

                                <SelectContent>
                                    {options.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    })}

                    <Button className="w-full" onClick={onSubmit}>
                        {t("getVideos")}
                    </Button>
                </div>
            </DialogContent>

        </Dialog>
    );
}