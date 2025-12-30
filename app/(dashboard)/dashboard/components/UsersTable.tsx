"use client";

import * as React from "react";
import { useGetUsersQuery, useSearchUsersQuery } from "@/services/api/usersApi";
import { User, UserSearchParams } from "@/types/user";
import { useTranslations } from "next-intl";
import {Spinner} from "@/components/Spinner";

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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";

export function UsersTable() {
    const t = useTranslations("Dashboard");

    // -----------------------
    // Search form state
    // -----------------------
    const [searchParams, setSearchParams] = React.useState<UserSearchParams>({
        q: "",
        username: "",
        firstName: "",
        lastName: "",
        status: undefined,
        accountType: undefined,
        metricaPlayerId: "",
    });

    // -----------------------
    // Table states
    // -----------------------
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // -----------------------
    // Fetch users
    // -----------------------
    // ابتدا همه کاربران را بگیریم
    const { data: allUsers = [], isLoading: isLoadingAll } = useGetUsersQuery();

    // سپس فیلتر شده‌ها
    const { data: filteredUsers = [], isLoading: isLoadingFiltered, refetch } = useSearchUsersQuery(searchParams);

    // کاربران برای جدول: اگر همه فیلدها خالی هستند، همه کاربران، وگرنه filtered
    const users = Object.values(searchParams).some(Boolean) ? filteredUsers : allUsers;
    const isLoading = Object.values(searchParams).some(Boolean) ? isLoadingFiltered : isLoadingAll;

    // -----------------------
    // Columns definition
    // -----------------------
    const columns: ColumnDef<User>[] = [
        { accessorKey: "firstName", header: t("firstName") },
        { accessorKey: "lastName", header: t("lastName") },
        { accessorKey: "username", header: t("phone") },
        { accessorKey: "accountType", header: t("accountType"), cell: ({ row }) => t(row.original.accountType) },
        { accessorKey: "status", header: t("status") },
        {
            id: "actions",
            header: t("actions"),
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>عملیات</DropdownMenuLabel>

                            {/* تغییر رمز عبور */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>تغییر رمز عبور</DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>تغییر رمز عبور</DialogTitle>
                                        <DialogDescription>یک رمز جدید وارد کنید</DialogDescription>
                                    </DialogHeader>
                                    <Input placeholder="رمز جدید" className="w-full" />
                                    <DialogFooter className="mt-4">
                                        <DialogClose className="px-4 py-2 bg-gray-200 dark:bg-muted rounded">انصراف</DialogClose>
                                        <Button>ذخیره</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* انتصاب بازیکن */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>انتصاب بازیکن</DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>انتصاب بازیکن</DialogTitle>
                                        <DialogDescription>بازیکن مورد نظر را انتخاب کنید</DialogDescription>
                                    </DialogHeader>
                                    <Input placeholder="نام بازیکن" className="w-full" />
                                    <DialogFooter className="mt-4">
                                        <DialogClose className="px-4 py-2 bg-gray-200 dark:bg-muted rounded">انصراف</DialogClose>
                                        <Button>ثبت</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.id))}>
                                کپی کردن ID کاربر
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // -----------------------
    // Table setup
    // -----------------------
    const table = useReactTable<User>({
        data: users,
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
        initialState: {
            pagination: {
                pageSize: 100,
            },
        },
    });

    // Reset page when filters change
    React.useEffect(() => {
        table.setPageIndex(0);
    }, [searchParams]);

    // -----------------------
    // Render
    // -----------------------
    if (isLoading) return <Spinner/>;

    return (
        <div className="w-full">
            {/* Search Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <Label>{t("userSearch")}</Label>
                    <Input
                        value={searchParams.q ?? ""}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, q: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label>{t("phone")}</Label>
                    <Input
                        value={searchParams.username ?? ""}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, username: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label>{t("firstName")}</Label>
                    <Input
                        value={searchParams.firstName ?? ""}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label>{t("lastName")}</Label>
                    <Input
                        value={searchParams.lastName ?? ""}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label>{t("status")}</Label>
                    <Select
                        value={searchParams.status}
                        onValueChange={(value) => setSearchParams(prev => ({ ...prev, status: value as UserSearchParams["status"] }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("status")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">{t("active")}</SelectItem>
                            <SelectItem value="INACTIVE">{t("inactive")}</SelectItem>
                            <SelectItem value="SUSPENDED">{t("suspended")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1">
                    <Label>{t("accountType")}</Label>
                    <Select
                        value={searchParams.accountType}
                        onValueChange={(value) => setSearchParams(prev => ({ ...prev, accountType: value as UserSearchParams["accountType"] }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("accountType")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PLAYER">PLAYER</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/*<div className="flex flex-col gap-1">*/}
                {/*    <Label>شناسه Metrica</Label>*/}
                {/*    <Input*/}
                {/*        value={searchParams.metricaPlayerId ?? ""}*/}
                {/*        onChange={(e) => setSearchParams(prev => ({ ...prev, metricaPlayerId: e.target.value }))}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div className="flex items-end">*/}
                {/*    <Button onClick={() => refetch()}>جستجو</Button>*/}
                {/*</div>*/}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className="text-center">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} className="hover:bg-gray-100 dark:hover:bg-muted/50">
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
                                    {t('noResultsFound')}
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
                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50, 100].map(size => (
                                <SelectItem key={size} value={String(size)}>
                                    {size} {t("row")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                    {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")} {table.getPageCount()}
                </div>
            </div>
        </div>
    );
}
