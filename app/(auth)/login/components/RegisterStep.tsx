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
import { smsService, authService } from "@/services/auth";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useLocale } from 'next-intl';



const schema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1, "نام الزامی است")
            .min(2, "نام باید حداقل ۲ حرف باشد")
            .regex(/^[\u0600-\u06FF\s]+$/, "نام باید فارسی باشد"),

        lastName: z
            .string()
            .trim()
            .min(1, "نام خانوادگی الزامی است")
            .min(2, "نام خانوادگی باید حداقل ۲ حرف باشد")
            .regex(/^[\u0600-\u06FF\s]+$/, "نام خانوادگی باید فارسی باشد"),
        password: z
            .string()
            .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
            .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "رمز عبور باید شامل حرف و عدد باشد"),
        confirmPassword: z.string(),
        code: z.string().min(4, "کد اس‌ام‌اس باید حداقل ۴ رقم باشد"),
    })
    .refine((d) => d.password === d.confirmPassword, {
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
    const [timer, setTimer] = useState(60);
    const intervalRef = useRef<number | null>(null);

    const locale = useLocale(); // 'fa' | 'en'


    const dispatch = useAppDispatch();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
            code: "",
        },
    });

    // State برای کنترل نمایش رمز
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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

    const sendSms = async () => {
        setLoadingSms(true);
        try {
            const res: any = await smsService.sendRegister(phone);
            setSmsSent(true);
            toast.success(res.message);
            startTimer();
        } catch (err: any) {
            console.error("خطا در ارسال اس‌ام‌اس:", err);
            setSmsSent(false);
            toast.error(err.message);
        } finally {
            setLoadingSms(false);
        }
    };

    useEffect(() => {
        // sendSms();
        setSmsSent(true);
        startTimer();
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
        try {
            const res: any = await authService.register({ ...data, username: phone });
            if (res?.id) toast.success('ثبت نام با موفقیت انجام شد');
            setStep("assign-player");
        } catch (err: any) {
            if (err?.status === 400) {
                toast.error("رمز عبور و کد پیامک نامعتبر است");
            } else if (err?.status === 409) {
                toast.error("این شماره قبلاً ثبت شده است");
            } else {
                toast.error("خطای ناشناخته رخ داد");
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        className={locale === 'fa' ? 'pl-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className={`absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer ${locale === 'fa' ? 'left-2' : 'right-2'}`}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
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
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirm ? "text" : "password"}
                                        className={locale === 'fa' ? 'pl-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((prev) => !prev)}
                                        className={`absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer ${locale === 'fa' ? 'left-2' : 'right-2'}`}
                                    >
                                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
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
                            <FormLabel>کد پیامک</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full cursor-pointer">
                    ثبت نام
                </Button>

                <div className="mt-2">
                    کد پیامک را به شماره <span className="font-bold"> {phone} </span> فرستادیم.
                </div>

                <div className="mt-2">
                    شماره موبایل اشتباه است؟{" "}
                    <span
                        className="font-bold text-app-orange cursor-pointer"
                        onClick={() => {
                            form.reset();
                            setStep('phone');
                        }}
                    >
                        ویرایش
                    </span>
                </div>

                <div className="mt-2">
                    {timer > 0 ? (
                        <p className="text-gray-500">
                            ارسال دوبارهٔ کد تأیید تا {formatTime(timer)}
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={sendSms}
                            className="text-app-orange cursor-pointer"
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
