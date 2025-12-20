"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Step } from "../types";
import { smsService } from "@/services/auth";
import { authService } from "@/services/auth";

const schema = z
    .object({
        firstName: z
            .string()
            .min(2)
            .regex(/^[\u0600-\u06FF\s]+$/, "نام باید فارسی باشد"),
        lastName: z
            .string()
            .min(2)
            .regex(/^[\u0600-\u06FF\s]+$/, "نام خانوادگی باید فارسی باشد"),
        password: z
            .string()
            .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
            .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "رمز عبور باید شامل حرف و عدد باشد"),
        confirmPassword: z.string(),
        code: z.string().min(4, "کد اس‌ام‌اس باید حداقل ۴ رقم باشد"),
    })
    .refine(d => d.password === d.confirmPassword, {
        path: ["confirmPassword"],
        message: "عدم تطابق رمز عبور",
    });

type FormValues = z.infer<typeof schema>;

export default function RegisterStep({
                                         phone,
                                         setStep,
                                     }: {
    phone: string;
    setStep: (s: Step) => void;
}) {
    const [loadingSms, setLoadingSms] = useState(false);
    const [smsSent, setSmsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { firstName: "", lastName: "", password: "", confirmPassword: "", code: "" },
    });

    // ارسال خودکار اس‌ام‌اس وقتی صفحه باز میشه
    useEffect(() => {
        sendSms();
    }, []);

    const sendSms = async () => {
        setLoadingSms(true);
        setError(null);
        try {
            await smsService.sendRegister(phone);
            setSmsSent(true);
        } catch (err: any) {
            console.error("خطا در ارسال اس‌ام‌اس:", err);
            setError("ارسال اس‌ام‌اس موفق نبود. دوباره تلاش کنید.");
            setSmsSent(false);
        } finally {
            setLoadingSms(false);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setError(null);
        try {
            await authService.register({ ...data, username: phone });
            setStep("assign-player");
        } catch (err: any) {
            if (err?.status === 400) {
                setError("رمز عبور و تکرار آن یکسان نیستند یا کد نامعتبر است.");
            } else if (err?.status === 409) {
                setError("این شماره همراه قبلاً ثبت شده است.");
            } else {
                setError("خطای ناشناخته رخ داده است.");
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && <p className="text-red-600">{error}</p>}

                <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>نام</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>نام خانوادگی</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>رمز عبور</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>تکرار رمز</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>کد اس‌ام‌اس</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="button" onClick={sendSms} disabled={loadingSms} className="w-full">
                    {loadingSms ? "در حال ارسال..." : "ارسال دوباره اس‌ام‌اس"}
                </Button>

                <Button type="submit" className="w-full">
                    ثبت نام
                </Button>
            </form>
        </Form>
    );
}
