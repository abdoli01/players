"use client";

import * as React from "react";
import {
    useGetMatchPlayersQuery,
    useSearchMatchPlayersQuery,
} from "@/services/api/matchPlayersApi";
import {
    MatchPlayer,
    MatchPlayerSearchParams,
} from "@/types/matchPlayer";

import { useTranslations } from "next-intl";
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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

export function MatchPlayersTable() {
    const t = useTranslations("Dashboard");

    // -----------------------
    // Search state
    // -----------------------
    const [searchParams, setSearchParams] =
        React.useState<MatchPlayerSearchParams>({
            matchId: "",
            teamSeasonToTournamentSeasonId: "",
            playerId: "",
            positionId: "",
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
        useGetMatchPlayersQuery();

    const { data: filteredData = [], isLoading: isLoadingFiltered } =
        useSearchMatchPlayersQuery(searchParams);

    const hasFilters = Object.values(searchParams).some(Boolean);

    const data = hasFilters ? filteredData : allData;
    const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll;

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<MatchPlayer>[] = [
        {
            accessorKey: "matchId",
            header: t("matchId"),
        },
        {
            accessorKey: "teamSeasonToTournamentSeasonId",
            header: t("teamSeasonToTournamentSeasonId"),
        },
        {
            accessorKey: "playerId",
            header: t("playerId"),
        },
        {
            accessorKey: "positionId",
            header: t("positionId"),
        },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                {t("actions")}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* later */}
                            {/* <EditMatchPlayerDialog data={item} /> */}
                            {/* <DeleteMatchPlayerDialog data={item} /> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // -----------------------
    // Table
    // -----------------------
    const table = useReactTable<MatchPlayer>({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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

    if (isLoading) return <Spinner />;

    return (
        <div className="w-full">
            <PageHeader title={t("matchPlayers")} />

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <Label>{t("matchId")}</Label>
                    <Input
                        value={searchParams.matchId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                matchId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("playerId")}</Label>
                    <Input
                        value={searchParams.playerId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                playerId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("positionId")}</Label>
                    <Input
                        value={searchParams.positionId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                positionId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>
                        {t("teamSeasonToTournamentSeasonId")}
                    </Label>
                    <Input
                        value={
                            searchParams.teamSeasonToTournamentSeasonId ?? ""
                        }
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                teamSeasonToTournamentSeasonId:
                                e.target.value,
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
                                    <TableHead
                                        key={header.id}
                                        className="text-center"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef
                                                    .header,
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

            {/* Pagination + pageSize */}
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
                            table.setPageIndex(
                                table.getPageCount() - 1
                            )
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        {t("last")}
                    </Button>

                    {/* pageSize */}
                    <Select
                        value={String(
                            table.getState().pagination.pageSize
                        )}
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