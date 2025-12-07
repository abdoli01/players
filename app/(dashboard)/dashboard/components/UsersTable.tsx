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
}

// ----------------------------
//      SAMPLE DATA
// ----------------------------
const data: UserType[] = [
    {
        id: 1,
        firstName: "Ali",
        lastName: "Karimi",
        role: "player",
        active: true,
    },
    {
        id: 2,
        firstName: "Ali",
        lastName: "Daei",
        role: "admin",
        active: false,
    },
    {
        id: 3,
        firstName: "Mehdi",
        lastName: "Mahdavikia",
        role: "admin",
        active: false,
    },
    {
        id: 4,
        firstName: "Ahmadreza",
        lastName: "Abedzadeh",
        role: "admin",
        active: false,
    },
    {
        id: 5,
        firstName: "Karim",
        lastName: "Bagheri",
        role: "admin",
        active: true,
    },
]

// ----------------------------
//      COLUMNS
// ----------------------------
export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: "id",
        header: "شماره کاربر",
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                نام <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "lastName",
        header: "نام خانوادگی",
    },
    {
        accessorKey: "role",
        header: "نوع کاربر",
        cell: ({ row }) => (
            <span>
        {row.original.role === "admin" ? "ادمین" : "بازیکن"}
      </span>
        ),
    },
    {
        accessorKey: "active",
        header: "وضعیت",
        cell: ({ row }) => (
            <span className={row.original.active ? "text-green-600" : "text-red-600"}>
        {row.original.active ? "فعال" : "غیرفعال"}
      </span>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
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

                        <DropdownMenuItem onClick={() => console.log("change password", user.id)}>
                            تغییر رمز عبور
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => console.log("assign player", user.id)}>
                            انتصاب بازیکن
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.id))}>
                            کپی کردن ID کاربر
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
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
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full mt-2">
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
