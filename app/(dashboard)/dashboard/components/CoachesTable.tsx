"use client";

import * as React from "react";
import {
    useGetCoachesQuery,
    useSearchCoachesQuery,
} from "@/services/api/coachesApi";
import { Coach, CoachSearchParams } from "@/types/coach";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function CoachesTable() {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // Search state
    // -----------------------
    const [searchParams, setSearchParams] =
        React.useState<CoachSearchParams>({
            q: "",
            fullName: "",
            fullNameEn: "",
            nationalId: "",
            passportId: "",
        });

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
    const { data: allCoaches = [], isLoading: isLoadingAll } =
        useGetCoachesQuery();

    const {
        data: filteredCoaches = [],
        isLoading: isLoadingFiltered,
    } = useSearchCoachesQuery(searchParams);

    const hasFilters = Object.values(searchParams).some(Boolean);
    const coaches = hasFilters ? filteredCoaches : allCoaches;
    const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll;

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<Coach>[] = [
        {
            accessorKey: "fullName",
            header: t("fullName"),
        },
        {
            accessorKey: "fullNameEn",
            header: t("fullNameEn"),
        },
        {
            accessorKey: "nationalId",
            header: t("nationalId"),
        },
        {
            accessorKey: "passportId",
            header: t("passportId"),
        },
        {
            accessorKey: "height",
            header: t("height"),
        },
    ];

    // -----------------------
    // Table
    // -----------------------
    const table = useReactTable({
        data: coaches,
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
    }, [searchParams]);

    // -----------------------
    // Render
    // -----------------------
    if (isLoading) return <Spinner />;

    return (
        <div className="w-full">
            <PageHeader title={tp("SideBar.coaches")} />

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <Label>{t("search")}</Label>
                    <Input
                        value={searchParams.q ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                q: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("fullName")}</Label>
                    <Input
                        value={searchParams.fullName ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("fullNameEn")}</Label>
                    <Input
                        value={searchParams.fullNameEn ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                fullNameEn: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("nationalId")}</Label>
                    <Input
                        value={searchParams.nationalId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                nationalId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("passportId")}</Label>
                    <Input
                        value={searchParams.passportId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                passportId: e.target.value,
                            }))
                        }
                    />
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
                                        <TableCell key={cell.id} className="text-center">
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
                                <SelectItem key={size} value={String(size)}>
                                    {size} {t("row")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                    {t("page")} {table.getState().pagination.pageIndex + 1}{" "}
                    {t("of")} {table.getPageCount()}
                </div>
            </div>
        </div>
    );
}