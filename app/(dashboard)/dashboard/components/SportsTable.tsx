"use client";

import * as React from "react";
import {
    useGetSportsQuery,
    useSearchSportsQuery,
} from "@/services/api/sportsApi";
import { Sport, SportSearchParams } from "@/types/sport";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";
import { CreateSportDialog } from "../components/CreateSportDialog";
// import { EditSportDialog } from "../components/EditSportDialog";
// import { DeleteSportDialog } from "../components/DeleteSportDialog";

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
import { MoreHorizontal } from "lucide-react";

export function SportsTable() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // Search state
    // -----------------------
    const [searchParams, setSearchParams] = React.useState<SportSearchParams>({
        q: "",
        fullName: "",
        shortName: "",
        fullNameEn: "",
        shortNameEn: "",
    });

    // -----------------------
    // Table states
    // -----------------------
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // -----------------------
    // Fetch data
    // -----------------------
    const { data: allSports = [], isLoading: isLoadingAll } = useGetSportsQuery();
    const { data: filteredSports = [], isLoading: isLoadingFiltered } = useSearchSportsQuery(searchParams);

    const hasFilters = Object.values(searchParams).some(Boolean);
    const sports = hasFilters ? filteredSports : allSports;
    const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll;

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<Sport>[] = [
        { accessorKey: "fullName", header: t("fullName") },
        { accessorKey: "shortName", header: t("shortName") },
        { accessorKey: "fullNameEn", header: t("fullNameEn") },
        { accessorKey: "shortNameEn", header: t("shortNameEn") },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => {
                const sport = row.original;
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
                            {/*<EditSportDialog sport={sport} />*/}
                            {/*<DeleteSportDialog sport={sport} />*/}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // -----------------------
    // Table
    // -----------------------
    const table = useReactTable<Sport>({
        data: sports,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        initialState: { pagination: { pageSize: 20 } },
    });

    React.useEffect(() => {
        table.setPageIndex(0);
    }, [searchParams]);

    // -----------------------
    // Render
    // -----------------------
    if (isLoading) return <Spinner />;

    return (
        <div className="w-full">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <Label>{t("search")}</Label>
                    <Input
                        value={searchParams.q ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({ ...prev, q: e.target.value }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("fullName")}</Label>
                    <Input
                        value={searchParams.fullName ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("shortName")}</Label>
                    <Input
                        value={searchParams.shortName ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({ ...prev, shortName: e.target.value }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("fullNameEn")}</Label>
                    <Input
                        value={searchParams.fullNameEn ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({ ...prev, fullNameEn: e.target.value }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("shortNameEn")}</Label>
                    <Input
                        value={searchParams.shortNameEn ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({ ...prev, shortNameEn: e.target.value }))
                        }
                    />
                </div>

                <div className="flex items-center justify-end flex-1">
                    <CreateSportDialog />
                </div>
            </div>

            {/* Table */}
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-4">
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
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {t("last")}
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                    {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")} {table.getPageCount()}
                </div>
            </div>
        </div>
    );
}
