"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { Spinner } from "@/components/Spinner";
import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";

import {
    useGetSettingsVisibleLanguagesManagementQuery,
    useUpdateSettingsVisibleLanguagesMutation,
} from "@/services/api/settingsApi";

import { VisibleLanguageManagement } from "@/types/settings";

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

import { Switch } from "@/components/ui/switch";

export function VisibleLanguagesTable() {
    const t = useTranslations("Dashboard");

    // -----------------------
    // API
    // -----------------------
    const { data, isLoading } =
        useGetSettingsVisibleLanguagesManagementQuery();

    const [updateVisibleLanguages] =
        useUpdateSettingsVisibleLanguagesMutation();

    // -----------------------
    // data آماده برای جدول
    // -----------------------
    const items: VisibleLanguageManagement[] = data?.items ?? [];

    // -----------------------
    // toggle + auto update
    // -----------------------
    const handleToggle = async (id: string) => {
        // optimistic update (local)
        const updated = items.map((item) =>
            item.id === id
                ? { ...item, visible: !item.visible }
                : item
        );

        try {
            const visibleLanguageIds = updated
                .filter((i) => i.visible)
                .map((i) => i.id);

            await updateVisibleLanguages({
                visibleLanguageIds,
            }).unwrap();

            toast.success(t("updateSuccess"));
        } catch (error) {
            toast.error(t("updateError"));
        }
    };

    // -----------------------
    // columns
    // -----------------------
    const columns: ColumnDef<VisibleLanguageManagement>[] = [
        {
            accessorKey: "fullName",
            header: t("language"),
        },
        {
            accessorKey: "code",
            header: t("code"),
        },
        {
            id: "visible",
            header: t("visible"),
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex justify-center" dir="ltr">
                        <Switch
                            checked={item.visible}
                            onCheckedChange={() => handleToggle(item.id)}
                        />
                    </div>
                );
            },
        },
    ];

    // -----------------------
    // table
    // -----------------------
    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // -----------------------
    // loading
    // -----------------------
    if (isLoading) return <Spinner />;

    // -----------------------
    // render
    // -----------------------
    return (
        <div className="w-full space-y-6">
            <PageHeader title={t("visibleLanguages")} />

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-center"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                        <TableCell
                                            key={cell.id}
                                            className="text-center"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
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