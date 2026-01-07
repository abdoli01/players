"use client";

import * as React from "react";
import {
    useGetTournamentSeasonsQuery,
    useSearchTournamentSeasonsQuery,
} from "@/services/api/tournamentSeasonsApi";
import {
    TournamentSeason,
    TournamentSeasonSearchParams,
    TournamentSeasonType,
} from "@/types/tournamentSeason";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner";

import {
    useReactTable,
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
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
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export function TournamentSeasonsTable() {
    const t = useTranslations("Dashboard");
    const locale = useLocale();
    const isRtl = locale === "fa";

    // -----------------------
    // Search state
    // -----------------------
    const [searchParams, setSearchParams] =
        React.useState<TournamentSeasonSearchParams>({
            q: "",
            tournamentId: "",
            seasonId: "",
            type: undefined,
        });

    // -----------------------
    // Fetch data
    // -----------------------
    const { data: allItems = [], isLoading: isLoadingAll } =
        useGetTournamentSeasonsQuery();

    const {
        data: filteredItems = [],
        isLoading: isLoadingFiltered,
    } = useSearchTournamentSeasonsQuery(searchParams);

    const hasFilters = Object.values(searchParams).some(
        (v) => v !== undefined && v !== ""
    );

    const data = hasFilters ? filteredItems : allItems;
    const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll;

    // -----------------------
    // Columns
    // -----------------------
    const columns: ColumnDef<TournamentSeason>[] = [
        {
            accessorKey: "tournament.fullName",
            header: t("tournament"),
        },
        {
            accessorKey: "season.fullName",
            header: t("season"),
        },
        {
            accessorKey: "type",
            header: t("type"),
        },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => (
                <DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Edit / Delete بعداً */}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    // -----------------------
    // Table
    // -----------------------
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 20 },
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
                    <Label>{t("tournament")}</Label>
                    <Input
                        value={searchParams.tournamentId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                tournamentId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("season")}</Label>
                    <Input
                        value={searchParams.seasonId ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                seasonId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <Label>{t("type")}</Label>
                    <select
                        className="border rounded px-2 h-10 bg-background"
                        value={searchParams.type ?? ""}
                        onChange={(e) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                type: e.target.value
                                    ? (e.target.value as TournamentSeasonType)
                                    : undefined,
                            }))
                        }
                    >
                        <option value="">همه</option>
                        <option value="LEAGUE">LEAGUE</option>
                        <option value="KNOCKOUT">KNOCKOUT</option>
                        <option value="MIXED">MIXED</option>
                        <option value="FRIENDLY">FRIENDLY</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
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
