"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Spinner } from "@/components/Spinner";
import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";

import {
    useReactTable,
    ColumnDef,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { useGetSettingsQuery } from "@/services/api/settingsApi";
import { UpdateSettingsDto, Settings } from "@/types/settings";
import { EditSettingsDialog } from "./EditSettingsDialog";

export function SettingsTable() {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    // Fetch settings
    const { data: settings, isLoading } = useGetSettingsQuery();

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<UpdateSettingsDto>[] = [
        {
            accessorFn: (row: any) => row.currentSeason?.fullName || "", // ← optional chaining
            id: "currentSeason",
            header: t("currentSeason"),
        },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => {
                if (!settings) return null;

                return (
                    <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* کامپوننت ویرایش */}
                            <EditSettingsDialog settings={settings} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // -----------------------
    // Table setup
    // -----------------------
    const table = useReactTable<UpdateSettingsDto>({
        data: settings ? [{ currentSeasonId: settings.currentSeasonId }] : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading || !settings) return <Spinner />;

    return (
        <div className="w-full">
            <PageHeader title={tp("SideBar.settings")} />

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {t("noResultsFound")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
