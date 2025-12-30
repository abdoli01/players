"use client"

import * as React from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {useTranslations} from "next-intl";
import { useGetUsersQuery } from "@/services/api/usersApi";
import {User} from "@/types/user"


// ----------------------------
//      TABLE WRAPPER
// ----------------------------
export function UsersTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const t = useTranslations("Dashboard")

    const { data: users = [], isLoading, error } = useGetUsersQuery();

    // ----------------------------
//      COLUMNS
// ----------------------------
     const columns: ColumnDef<User>[] = [
        // { accessorKey: "id", header: t("id") },
        { accessorKey: "firstName", header: t("firstName"), cell: ({ row }) => row.original.firstName },
        { accessorKey: "lastName", header: t("lastName"), cell: ({ row }) => row.original.lastName },
        { accessorKey: "username", header: t("phone"), cell: ({ row }) => row.original.username },
        { accessorKey: "role", header: t("role"), cell: ({ row }) => t(row.original.accountType) },
        { accessorKey: "status", header: t("active"), cell: ({ row }) => row.original.status},
        {
            id: "actions",
            header: "عملیات",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        تغییر رمز عبور
                                    </DropdownMenuItem>
                                </DialogTrigger>

                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>تغییر رمز عبور</DialogTitle>
                                        <DialogDescription>
                                            یک رمز جدید وارد کنید
                                        </DialogDescription>
                                    </DialogHeader>

                                    <input
                                        className="border p-2 rounded w-full"
                                        placeholder="رمز جدید"
                                    />

                                    <DialogFooter className="mt-4">
                                        <DialogClose className="px-4 py-2 bg-gray-200 dark:bg-muted rounded">
                                            انصراف
                                        </DialogClose>
                                        <Button>ذخیره</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>انتصاب بازیکن</DropdownMenuItem>
                                </DialogTrigger>

                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>انتصاب بازیکن</DialogTitle>
                                        <DialogDescription>
                                            بازیکن مورد نظر را انتخاب کنید
                                        </DialogDescription>
                                    </DialogHeader>

                                    <input className="border p-2 rounded w-full" placeholder="نام بازیکن" />

                                    <DialogFooter className="mt-4">
                                        <DialogClose className="px-4 py-2 bg-gray-200 dark:bg-muted rounded">
                                            انصراف
                                        </DialogClose>
                                        <Button>ثبت</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.id))}>کپی کردن ID کاربر</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const table = useReactTable<User>({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection }
    })


    return (
        <div className="w-full">
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
                                <TableRow className="hover:bg-gray-100 dark:hover:bg-muted/50" key={row.id}>
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
                                    نتیجه‌ای یافت نشد.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>

    )
}
