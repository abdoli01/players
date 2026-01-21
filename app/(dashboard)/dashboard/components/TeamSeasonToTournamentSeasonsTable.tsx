"use client";

import * as React from "react";
import {
    useGetTeamSeasonToTournamentSeasonsQuery,
    useSearchTeamSeasonToTournamentSeasonsQuery,
} from "@/services/api/teamSeasonToTournamentSeasonsApi";
import {
    TeamSeasonToTournamentSeason,
    TeamSeasonToTournamentSeasonSearchParams,
} from "@/types/teamSeasonToTournamentSeason";
import { useGetTeamSeasonsQuery } from "@/services/api/teamSeasonsApi";
import { useGetTournamentSeasonsQuery } from "@/services/api/tournamentSeasonsApi";
import { useGetTeamsQuery } from "@/services/api/teamsApi";
import { useGetTournamentsQuery } from "@/services/api/tournamentsApi";
import { useGetSeasonsQuery } from "@/services/api/seasonsApi";
import {PageHeader} from "@/app/(dashboard)/dashboard/components/PageHeader";

import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";

import {
    useReactTable,
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
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
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export function TeamSeasonToTournamentSeasonsTable() {
    const t = useTranslations("Dashboard");
    const tp = useTranslations();
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // Search state
    // -----------------------
    const [searchParams, setSearchParams] =
        React.useState<TeamSeasonToTournamentSeasonSearchParams>({
            q: "",
            teamSeasonId: "",
            tournamentSeasonId: "",
        });

    // -----------------------
    // Fetch all data
    // -----------------------
    const { data: allRelations = [], isLoading: isLoadingAll } =
        useGetTeamSeasonToTournamentSeasonsQuery();
    const { data: filteredRelations = [], isLoading: isLoadingFiltered } =
        useSearchTeamSeasonToTournamentSeasonsQuery(searchParams);

    const { data: teamSeasons = [] } = useGetTeamSeasonsQuery();
    const { data: tournamentSeasons = [] } = useGetTournamentSeasonsQuery();
    const { data: teams = [] } = useGetTeamsQuery();
    const { data: tournaments = [] } = useGetTournamentsQuery();
    const { data: seasons = [] } = useGetSeasonsQuery();

    const hasFilters = Object.values(searchParams).some(Boolean);
    const relations = hasFilters ? filteredRelations : allRelations;
    const isLoading = isLoadingAll || isLoadingFiltered;

    // -----------------------
    // Lookup helpers
    // -----------------------
    const teamSeasonLabel = (teamSeasonId: string) => {
        const ts = teamSeasons.find(ts => ts.id === teamSeasonId);
        if (!ts) return teamSeasonId;
        const team = teams.find(t => t.id === ts.teamId)?.fullName ?? ts.teamId;
        const season = seasons.find(s => s.id === ts.seasonId)?.fullName ?? ts.seasonId;
        return `${team} - ${season}`;
    };

    const tournamentSeasonLabel = (tournamentSeasonId: string) => {
        const ts = tournamentSeasons.find(ts => ts.id === tournamentSeasonId);
        if (!ts) return tournamentSeasonId;
        const tournament = tournaments.find(t => t.id === ts.tournamentId)?.fullName ?? ts.tournamentId;
        const season = seasons.find(s => s.id === ts.seasonId)?.fullName ?? ts.seasonId;
        return `${tournament} - ${season}`;
    };

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<TeamSeasonToTournamentSeason>[] = [
        {
            accessorKey: "teamSeasonId",
            header: t("teamSeason"),
            cell: ({ row }) => teamSeasonLabel(row.original.teamSeasonId),
        },
        {
            accessorKey: "tournamentSeasonId",
            header: t("tournamentSeason"),
            cell: ({ row }) => tournamentSeasonLabel(row.original.tournamentSeasonId),
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
        //                 {/* Edit/Delete dialogs can go here */}
        //             </DropdownMenuContent>
        //         </DropdownMenu>
        //     ),
        // },
    ];

    // -----------------------
    // React Table
    // -----------------------
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable<TeamSeasonToTournamentSeason>({
        data: relations,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        initialState: { pagination: { pageSize: 20 } },
    });

    React.useEffect(() => {
        table.setPageIndex(0);
    }, [searchParams]);

    if (isLoading) return <Spinner />;

    // -----------------------
    // Render
    // -----------------------
    return (
        <div className="w-full">
            <PageHeader
                title={tp("SideBar.teamSeasonToTournamentSeasons")}
            />
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                {/* Search */}
                <div className="flex flex-col gap-1">
                    <Label>{t("search")}</Label>
                    <input
                        type="text"
                        className="border rounded px-2 h-10"
                        value={searchParams.q ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchParams(prev => ({ ...prev, q: e.target.value }))
                        }
                    />
                </div>

                {/* TeamSeason */}
                <div className="flex flex-col gap-1">
                    <Label>{t("teamSeason")}</Label>
                    <select
                        className="border rounded px-2 h-10 bg-background"
                        value={searchParams.teamSeasonId ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setSearchParams(prev => ({ ...prev, teamSeasonId: e.target.value }))
                        }
                    >
                        <option value="">همه</option>
                        {teamSeasons.map(ts => (
                            <option key={ts.id} value={ts.id}>
                                {teamSeasonLabel(ts.id)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* TournamentSeason */}
                <div className="flex flex-col gap-1">
                    <Label>{t("tournamentSeason")}</Label>
                    <select
                        className="border rounded px-2 h-10 bg-background"
                        value={searchParams.tournamentSeasonId ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setSearchParams(prev => ({ ...prev, tournamentSeasonId: e.target.value }))
                        }
                    >
                        <option value="">همه</option>
                        {tournamentSeasons.map(ts => (
                            <option key={ts.id} value={ts.id}>
                                {tournamentSeasonLabel(ts.id)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(header => (
                                    <TableHead key={header.id} className="text-center">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
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
                    <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                        {t("first")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        {t("previous")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        {t("next")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
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
