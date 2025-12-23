"use client";

import { useEffect, useState, useRef } from "react";
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

import { Step } from "../types";
import { smsService, passwordService } from "@/services/auth";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
    code: z.string().min(4, "کد اس‌ام‌اس را وارد کنید"),
    newPassword: z
        .string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "رمز عبور باید شامل حداقل یک حرف و یک عدد باشد"),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordStep({
                                              userMeta,
                                              setStep,
                                              phone,
                                          }: {
    userMeta: any;
    setStep: (s: Step) => void;
    phone: string;
}) {
    const [loadingSms, setLoadingSms] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const [showPassword, setShowPassword] = useState(false);

    const intervalRef = useRef<number | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: "", newPassword: "" },
    });

    // ⏱️ تایمر
    const startTimer = () => {
        setTimer(60);
        if (intervalRef.current) window.clearInterval(intervalRef.current);

        intervalRef.current = window.setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current) window.clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // 📩 ارسال SMS
    const sendSms = async () => {
        setLoadingSms(true);
        setError(null);
        try {
            await smsService.sendReset(phone);
            startTimer();
        } catch {
            setError("ارسال اس‌ام‌اس موفق نبود. دوباره تلاش کنید.");
        } finally {
            setLoadingSms(false);
        }
    };

    useEffect(() => {
        sendSms();
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
            setStep("login");
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

                {/* 🔐 رمز جدید + آیکن چشم */}
                <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>رمز جدید</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        disabled={loadingSubmit}
                                        className="pl-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loadingSubmit}>
                    {loadingSubmit ? "در حال ذخیره..." : "ذخیره"}
                </Button>

                <div className="mt-2 text-center">
                    {timer > 0 ? (
                        <p className="text-gray-500">
                            ارسال دوبارهٔ کد تأیید تا {formatTime(timer)}
                        </p>
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
