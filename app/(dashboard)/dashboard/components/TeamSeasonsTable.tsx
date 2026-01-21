"use client";

import * as React from "react";
import {
    useGetTeamSeasonsQuery,
    useSearchTeamSeasonsQuery,
} from "@/services/api/teamSeasonsApi";
import { TeamSeason, TeamSeasonSearchParams } from "@/types/teamSeason";
import { useGetTeamsQuery } from "@/services/api/teamsApi";
import { useGetSeasonsQuery } from "@/services/api/seasonsApi";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";

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
import {PageHeader} from "@/app/(dashboard)/dashboard/components/PageHeader";


export function TeamSeasonsTable() {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    const [searchParams, setSearchParams] =
        React.useState<TeamSeasonSearchParams>({
            q: "",
            teamId: "",
            seasonId: "",
        });

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // -----------------------
    // Fetch team-seasons
    // -----------------------
    const { data: allTeamSeasons = [], isLoading: isLoadingAll } =
        useGetTeamSeasonsQuery();
    const { data: filteredTeamSeasons = [], isLoading: isLoadingFiltered } =
        useSearchTeamSeasonsQuery(searchParams);

    const hasFilters = Object.values(searchParams).some(Boolean);
    const teamSeasons = hasFilters ? filteredTeamSeasons : allTeamSeasons;
    const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll;

    // -----------------------
    // Fetch teams and seasons for select
    // -----------------------
    const { data: teams = [] } = useGetTeamsQuery();
    const { data: seasons = [] } = useGetSeasonsQuery();

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<TeamSeason>[] = [
        {
            accessorKey: "team.fullName",
            header: t("team"),
        },
        {
            accessorKey: "season.fullName",
            header: t("season"),
        },
        // {
        //     id: "actions",
        //     header: t("actions"),
        //     cell: ({ row }) => (
        //         <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
        //             <DropdownMenuTrigger asChild>
        //                 <Button variant="ghost" className="h-8 w-8 p-0">
        //                     <MoreHorizontal className="h-4 w-4" />
        //                 </Button>
        //             </DropdownMenuTrigger>
        //             <DropdownMenuContent align="end">
        //                 <DropdownMenuLabel>عملیات</DropdownMenuLabel>
        //                 <DropdownMenuSeparator />
        //                 {/* EditTeamSeasonDialog */}
        //             </DropdownMenuContent>
        //         </DropdownMenu>
        //     ),
        // },
    ];

    // -----------------------
    // Table
    // -----------------------
    const table = useReactTable<TeamSeason>({
        data: teamSeasons,
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

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full">
            <PageHeader
                title={tp("SideBar.teamSeasons")}
            />
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
                    <Label>{t("team")}</Label>
                    <select
                        className="border rounded px-2 h-10 bg-background"
                        value={searchParams.teamId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({ ...prev, teamId: e.target.value }))
                        }
                    >
                        <option value="">{t("all")}</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("season")}</Label>
                    <select
                        className="border rounded px-2 h-10 bg-background"
                        value={searchParams.seasonId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({ ...prev, seasonId: e.target.value }))
                        }
                    >
                        <option value="">{t("all")}</option>
                        {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                                {season.fullName}
                            </option>
                        ))}
                    </select>
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
                    {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
                    {table.getPageCount()}
                </div>
            </div>
        </div>
    );
}
