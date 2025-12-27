"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import LocaleSwitcher from "@/components/LocaleSwitcher";


import { Step } from "../types";
import {authService, smsService} from "@/services/auth";
import {toast} from "react-toastify";
import Image from "next/image";

const schema = z.object({
    phone: z
        .string()
        .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    phone: string; // مقدار شماره موبایل از wizard
    setPhone: (phone: string) => void;
    setUserMeta: (meta: { exists: boolean; hasPlayerAssignment?: boolean }) => void;
    setStep: (step: Step) => void;
}

export default function PhoneStep({
                                      phone,
                                      setPhone,
                                      setUserMeta,
                                      setStep,
                                  }: Props) {
    // 🟢 react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { phone },
    });

    // 🔹 Sync مقدار wizard state با input



    const onSubmit = async (data: FormValues) => {
        try {
            // بررسی اینکه شماره موبایل ثبت شده یا نه
            const res = await authService.checkUsername({ username: data.phone });

            // بروزرسانی wizard state
            setPhone(data.phone);
            setUserMeta(res);

            // تصمیم جریان
            if (res.exists) {
                setStep("login");
            } else {
                await sendSms(data.phone);
            }
        } catch (error: any) {
            form.setError("phone", {
                message: error?.message || "خطا در بررسی شماره",
            });
        }
    };
    const sendSms = async (phone: string) => {
        try {
            const res: any = await smsService.sendRegister(phone);
            toast.success(res.message);
            setStep("register");
        } catch (err:any) {
            console.error("خطا در ارسال اس‌ام‌اس:", err);
            toast.error(err.message);
        }
    };


    return (
        <>
            <div className="flex items-center justify-between">
                <Image src="/images/logo-new.png" alt="logo"  width={47} height={56}   loading="eager" priority/>
                <LocaleSwitcher />
            </div>
            <div className="text-xl my-3">خوش آمدید!</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>شماره موبایل</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="text-center"
                                        placeholder="09123456789"
                                        autoFocus
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className="w-full" type="submit">
                        ادامه
                    </Button>
                </form>
            </Form>
        </>
    );
}
