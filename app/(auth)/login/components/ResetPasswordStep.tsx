"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Step } from "../types";
import { smsService, passwordService } from "@/services/auth";

const schema = z.object({
    code: z.string().min(4, "کد اس‌ام‌اس را وارد کنید"),
    newPassword: z
        .string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "رمز عبور باید شامل حداقل یک حرف و یک عدد باشد"),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordStep({ userMeta, setStep, phone }: { userMeta: any; setStep: (s: Step) => void; phone: string; }) {
    const [loadingSms, setLoadingSms] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [smsSent, setSmsSent] = useState(false);
    const [timer, setTimer] = useState(60);
    const intervalRef = useRef<number | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: "", newPassword: "" },
    });

    // شروع تایمر
    const startTimer = () => {
        setTimer(60);
        if (intervalRef.current) window.clearInterval(intervalRef.current);

        intervalRef.current = window.setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    if (intervalRef.current) window.clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // ارسال اس‌ام‌اس
    const sendSms = async () => {
        setLoadingSms(true);
        setError(null);
        try {
            await smsService.sendReset(phone);
            setSmsSent(true);
            startTimer();
        } catch (err: any) {
            console.error(err);
            setError("ارسال اس‌ام‌اس موفق نبود. دوباره تلاش کنید.");
            setSmsSent(false);
        } finally {
            setLoadingSms(false);
        }
    };

    useEffect(() => {
        sendSms(); // ارسال خودکار هنگام mount
        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const onSubmit = async (data: FormValues) => {
        setError(null);
        setLoadingSubmit(true);
        try {
            await passwordService.verifyReset({
                username: phone,
                code: data.code,
                newPassword: data.newPassword,
            });
            // setStep(userMeta.hasPlayerAssignment ? "assign-player" : "assign-player");
            setStep(userMeta.hasPlayerAssignment ? "login" : "login");
        } catch (err: any) {
            if (err?.status === 400) setError("کد اشتباه است یا منقضی شده");
            else if (err?.status === 404) setError("کاربری با این شماره یافت نشد");
            else setError("خطای ناشناخته رخ داد");
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && <p className="text-red-600">{error}</p>}

                <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>کد پیامک</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={loadingSubmit} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>رمز جدید</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} disabled={loadingSubmit} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loadingSubmit}>
                    {loadingSubmit ? "در حال ذخیره..." : "ذخیره"}
                </Button>

                {/* نمایش تایمر یا دکمه ارسال دوباره */}
                <div className="mt-2 text-center">
                    {timer > 0 ? (
                        <p className="text-gray-500">ارسال دوبارهٔ کد تأیید تا {formatTime(timer)}</p>
                    ) : (
                        <button
                            type="button"
                            onClick={sendSms}
                            className="text-blue-600 underline"
                            disabled={loadingSms}
                        >
                            ارسال دوباره کد با پیامک
                        </button>
                    )}
                </div>
            </form>
        </Form>
    );
}
