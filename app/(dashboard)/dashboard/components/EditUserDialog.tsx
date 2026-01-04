"use client";

import * as React from "react";
import { User } from "@/types/user";
import { useUpdateUserMutation } from "@/services/api/usersApi";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useLocale } from "next-intl";


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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";


type Props = {
    user: User;
};

/* =========================
   Zod Schema
========================= */
const editUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
    expireDate: z.date().nullable().optional(),
    metricaPlayerId: z.string().optional(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

/* =========================
   Component
========================= */
export function EditUserDialog({ user }: Props) {
    const [open, setOpen] = React.useState(false);
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const locale = useLocale();
    const isRtl = locale === "fa";

    const form = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
        mode: "onSubmit",
        defaultValues: {
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            status: user.status,
            expireDate: user.expireDate ? new Date(user.expireDate) : null,
            metricaPlayerId: user.metricaPlayerId ?? "",
        },
    });

    const onSubmit = async (values: EditUserFormValues) => {
        try {
            const payload: Partial<User> = {
                ...values,
                expireDate: values.expireDate
                    ? values.expireDate.toISOString()
                    : null,
            };

            await updateUser({ id: user.id, body: payload }).unwrap();

            toast.success("اطلاعات کاربر با موفقیت ذخیره شد");
            setOpen(false);
        } catch (err: any) {
            const status = err?.status;
            if (status === 400) toast.error("اطلاعات وارد شده نامعتبر است");
            else if (status === 403) toast.error("شما مجوز ویرایش این کاربر را ندارید");
            else if (status === 404) toast.error("کاربر مورد نظر یافت نشد");
            else toast.error("خطای غیرمنتظره‌ای رخ داد");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    ویرایش کاربر
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader className={isRtl ? '!text-right' : ''}>
                    <DialogTitle>ویرایش کاربر</DialogTitle>
                    <DialogDescription>
                        اطلاعات کاربر را ویرایش کنید
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
                    {/* First Name */}
                    <div>
                        <Input {...form.register("firstName")} placeholder="نام" />
                        {form.formState.errors.firstName && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.firstName.message}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <Input {...form.register("lastName")} placeholder="نام خانوادگی" />
                        {form.formState.errors.lastName && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.lastName.message}
                            </p>
                        )}
                    </div>

                    {/* Status - shadcn Select */}
                    <div>
                        <Select
                            value={form.watch("status")}
                            onValueChange={(value) =>
                                form.setValue("status", value as EditUserFormValues["status"])
                            }

                        >
                            <SelectTrigger dir={isRtl ? 'rtl' : 'ltr'} className='w-full'>
                                <SelectValue placeholder="وضعیت" />
                            </SelectTrigger>
                            <SelectContent dir={isRtl ? 'rtl' : 'ltr'}>
                                <SelectItem value="ACTIVE">فعال</SelectItem>
                                <SelectItem value="INACTIVE">غیرفعال</SelectItem>
                                <SelectItem value="SUSPENDED">مسدود</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.status && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.status.message}
                            </p>
                        )}
                    </div>

                    {/* Metrica Player ID */}
                    <div>
                        <Input {...form.register("metricaPlayerId")} placeholder="Metrica Player ID" />
                    </div>

                    {/* Expire Date - شمسی */}
                    <div>
                        <DatePicker
                            plugins={[<TimePicker key="time-picker" position="bottom" hideSeconds />]}
                            calendar={persian}
                            locale={persian_fa}
                            value={form.watch("expireDate")}
                            onChange={(date) => {
                                form.setValue("expireDate", date ? date.toDate() : null);
                            }}
                            format="YYYY/MM/DD HH:mm"
                            calendarPosition="bottom-right"
                            editable={true}
                            className='bg-background text-foreground w-full'
                            inputClass="w-full h-10 px-3 rounded border border-gray-300 text-foreground"
                            placeholder="تاریخ"

                        />
                                                    <style>{`
                              .rmdp-time-picker input {
                                color: black;  /* رنگ اعداد داخل TimePicker */
                              }
                            `}</style>
                        {form.formState.errors.expireDate && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.expireDate.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <DialogClose type="button" className="px-4 py-2 bg-foreground/30 rounded">
                          انصراف
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "در حال ذخیره..." : "ذخیره"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
