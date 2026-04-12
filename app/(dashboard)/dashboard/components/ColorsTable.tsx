"use client";

import * as React from "react";
import {
    useGetColorsQuery,
    useGetDefaultColorQuery,
} from "@/services/api/colorsApi";
import { Color } from "@/types/color";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";
import { CreateColorDialog } from "../components/CreateColorDialog";
// import { EditColorDialog } from "../components/EditColorDialog";
import { DeleteColorDialog } from "../components/DeleteColorDialog";
import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";

import {
    useReactTable,
    ColumnDef,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
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
import { Label } from "@/components/ui/label";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal } from "lucide-react";

export function ColorsTable() {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // Search
    // -----------------------
    const [search, setSearch] = React.useState("");

    // -----------------------
    // Table states
    // -----------------------
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // -----------------------
    // Fetch data
    // -----------------------
    const { data: colors = [], isLoading } = useGetColorsQuery();
    const { data: defaultColor } = useGetDefaultColorQuery();

    // -----------------------
    // Filtered Data
    // -----------------------
    const filteredColors = React.useMemo(() => {
        if (!search.trim()) return colors;

        return colors.filter((item) =>
            item.title?.toLowerCase().includes(search.toLowerCase())
        );
    }, [colors, search]);

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<Color>[] = [
        {
            accessorKey: "title",
            header: t("title"),
        },
        {
            accessorKey: "H1",
            header: "H1",
        },
        {
            accessorKey: "H2",
            header: "H2",
        },
        {
            accessorKey: "G1",
            header: "G1",
        },
        {
            accessorKey: "G2",
            header: "G2",
        },
        {
            accessorKey: "HG3",
            header: "HG3",
        },
        {
            accessorKey: "HG4",
            header: "HG4",
        },
        {
            accessorKey: "ACN1",
            header: "ACN1",
        },
        {
            accessorKey: "ACN2",
            header: "ACN2",
        },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => {
                const color = row.original;
                const isDefault = defaultColor?.id === color.id;

                return (
                    <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/*<EditColorDialog*/}
                            {/*    colorData={color}*/}
                            {/*    isDefault={isDefault}*/}
                            {/*/>*/}

                            {!isDefault && (
                                <DeleteColorDialog colorData={color} />
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // -----------------------
    // Table
    // -----------------------
    const table = useReactTable<Color>({
        data: filteredColors,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    React.useEffect(() => {
        table.setPageIndex(0);
    }, [search]);

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full">
            <PageHeader title={tp("SideBar.colors")} />

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <Label>{t("search")}</Label>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("search")}
                    />
                </div>

                <div className="flex items-center justify-end flex-1">
                    <CreateColorDialog />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t("first")}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t("previous")}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {t("next")}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        {t("last")}
                    </Button>

                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={(value) =>
                            table.setPageSize(Number(value))
                        }
                    >
                        <SelectTrigger className="w-auto">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {[5, 10, 20, 50, 100].map((size) => (
                                <SelectItem
                                    key={size}
                                    value={String(size)}
                                >
                                    {size} {t("row")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                    {t("page")}{" "}
                    {table.getState().pagination.pageIndex + 1}{" "}
                    {t("of")} {table.getPageCount()}
                </div>
            </div>
        </div>
    );
}