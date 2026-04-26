"use client";

import * as React from "react";
import {
    useGetCoachTeamsQuery,
    useSearchCoachTeamsQuery,
} from "@/services/api/coachTeamsApi";
import { CoachTeam, CoachTeamSearchParams } from "@/types/coachTeam";
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

export function CoachTeamsTable() {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // Search state
    // -----------------------
    const [searchParams, setSearchParams] =
        React.useState<CoachTeamSearchParams>({
            q: "",
            coachId: "",
            teamId: "",
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
    const { data: allData = [], isLoading: isLoadingAll } =
        useGetCoachTeamsQuery();

    const {
        data: filteredData = [],
        isLoading: isLoadingFiltered,
    } = useSearchCoachTeamsQuery(searchParams);

    const hasFilters = Object.values(searchParams).some(Boolean);
    const data = hasFilters ? filteredData : allData;
    const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll;

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<CoachTeam>[] = [
        { accessorKey: "coachId", header: t("coachId") },
        { accessorKey: "teamId", header: t("teamId") },
        { accessorKey: "startDate", header: t("startDate") },
        { accessorKey: "endDate", header: t("endDate") },
    ];

    // -----------------------
    // Table
    // -----------------------
    const table = useReactTable({
        data,
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
            pagination: { pageSize: 10 },
        },
    });

    React.useEffect(() => {
        table.setPageIndex(0);
    }, [searchParams]);

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full">
            <PageHeader title={tp("SideBar.coachTeams")} />

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
                    <Label>{t("coachId")}</Label>
                    <Input
                        value={searchParams.coachId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                coachId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("teamId")}</Label>
                    <Input
                        value={searchParams.teamId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                teamId: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center">
                                        {flexRender(
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
                                <TableCell colSpan={columns.length} className="text-center">
                                    {t("noResultsFound")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                    <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        {t("previous")}
                    </Button>
                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        {t("next")}
                    </Button>
                </div>

                <div>
                    {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
                    {table.getPageCount()}
                </div>
            </div>
        </div>
    );
}