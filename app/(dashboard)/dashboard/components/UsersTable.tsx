"use client"

import * as React from "react"
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

// ----------------------------
//      TYPE
// ----------------------------
export type UserType = {
    id: number
    firstName: string
    lastName: string
    role: "player" | "admin"
    active: boolean
    phone: string
}

// ----------------------------
//      SAMPLE DATA
// ----------------------------
const data: UserType[] = [
    { id: 1, firstName: "Ali", lastName: "Karimi", phone: "09121234567", role: "player", active: true },
    { id: 2, firstName: "Ali", lastName: "Daei", phone: "09123456789", role: "admin", active: false },
    { id: 3, firstName: "Mehdi", lastName: "Mahdavikia", phone: "09129876543", role: "admin", active: false },
    { id: 4, firstName: "Ahmadreza", lastName: "Abedzadeh", phone: "09127654321", role: "admin", active: false },
    { id: 5, firstName: "Karim", lastName: "Bagheri", phone: "09121239876", role: "admin", active: true },
]

// ----------------------------
//      COLUMNS
// ----------------------------
export const columns: ColumnDef<UserType>[] = [
    { accessorKey: "id", header: "شماره کاربر" },
    { accessorKey: "firstName", header: "نام", cell: ({ row }) => row.original.firstName },
    { accessorKey: "lastName", header: "نام خانوادگی", cell: ({ row }) => row.original.lastName },
    { accessorKey: "phone", header: "شماره تلفن", cell: ({ row }) => row.original.phone }, // ستون اضافه شد
    { accessorKey: "role", header: "نوع کاربر", cell: ({ row }) => row.original.role === "admin" ? "ادمین" : "بازیکن" },
    { accessorKey: "active", header: "وضعیت", cell: ({ row }) => row.original.active ? "فعال" : "غیرفعال" },
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
                        <DropdownMenuItem onClick={() => console.log("change password", user.id)}>تغییر رمز عبور</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("assign player", user.id)}>انتصاب بازیکن</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.id))}>کپی کردن ID کاربر</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

// ----------------------------
//      TABLE WRAPPER
// ----------------------------
export function UsersTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
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
        <div className="w-full mt-2">
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
