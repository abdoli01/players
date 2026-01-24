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
import { Input } from "@/components/ui/input";

import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/services/api/settingsApi";
import { UpdateSettingsDto } from "@/types/settings";
import { toast } from "react-toastify";

export function SettingsTable() {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // Fetch settings
    // -----------------------
    const { data: settings, isLoading } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    // Editable state
    const [editableSettings, setEditableSettings] = React.useState<UpdateSettingsDto | null>(null);

    React.useEffect(() => {
        if (settings) setEditableSettings({ currentSeasonId: settings.currentSeasonId });
    }, [settings]);

    // Columns
    const columns: ColumnDef<UpdateSettingsDto>[] = [
        {
            accessorKey: "currentSeasonId",
            header: t("currentSeasonId"),
            cell: ({ row }) => (
                <Input
                    type="text"
                    value={row.original.currentSeasonId}
                    onChange={(e) => {
                        setEditableSettings((prev) =>
                            prev ? { ...prev, currentSeasonId: e.target.value } : null
                        );
                    }}
                />
            ),
        },
        {
            id: "actions",
            header: t("actions"),
            cell: () => (
                <Button
                    size="sm"
                    disabled={isUpdating || !editableSettings}
                    onClick={async () => {
                        if (!editableSettings) return;
                        try {
                            await updateSettings(editableSettings).unwrap();
                            toast.success(tp("successAction"));
                        } catch (err) {
                            console.error(err);
                            toast.error(tp("errorAction"));
                        }
                    }}
                >
                    {t("edit")}
                </Button>
            ),
        },
    ];

    // Table setup
    const table = useReactTable<UpdateSettingsDto>({
        data: editableSettings ? [editableSettings] : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading || !editableSettings) return <Spinner />;

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
