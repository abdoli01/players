"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { Spinner } from "@/components/Spinner";
import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";

import {
    useGetSettingsVisibleAccountTypesManagementQuery,
    useUpdateSettingsVisibleAccountTypesMutation,
} from "@/services/api/settingsApi";

import { VisibleAccountTypeManagement } from "@/types/settings";

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
import { Switch } from "@/components/ui/switch";

export function VisibleAccountTypesTable() {
    const t = useTranslations("Dashboard");

    // -----------------------
    // API
    // -----------------------
    const { data, isLoading } =
        useGetSettingsVisibleAccountTypesManagementQuery();

    const [updateVisibleTypes, { isLoading: isUpdating }] =
        useUpdateSettingsVisibleAccountTypesMutation();

    // -----------------------
    // local state
    // -----------------------
    const [items, setItems] = React.useState<VisibleAccountTypeManagement[]>([]);

    // sync API -> state
    React.useEffect(() => {
        if (data?.items) {
            setItems(data.items);
        }
    }, [data]);

    // -----------------------
    // toggle switch
    // -----------------------
    const handleToggle = (key: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.key === key
                    ? { ...item, visible: !item.visible }
                    : item
            )
        );
    };

    // -----------------------
    // save
    // -----------------------
    const handleSave = async () => {
        try {
            const visibleAccountTypes = items
                .filter((i) => i.visible)
                .map((i) => i.key);

            await updateVisibleTypes({
                visibleAccountTypes,
            }).unwrap();

            toast.success(t("updateSuccess"));
        } catch (error) {
            toast.error(t("updateError"));
        }
    };

    // -----------------------
    // columns
    // -----------------------
    const columns: ColumnDef<VisibleAccountTypeManagement>[] = [
        {
            accessorKey: "title",
            header: t("title"),
        },
        {
            accessorKey: "key",
            header: t("key"),
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
                            onCheckedChange={() => handleToggle(item.key)}
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
            <PageHeader title={t("visibleAccountTypes")} />

            {/* TABLE */}
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

            {/* SAVE */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                >
                    {t("saveChanges")}
                </Button>
            </div>
        </div>
    );
}