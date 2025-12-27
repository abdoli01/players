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
import { useLocale, useTranslations } from 'next-intl';

type FormValues = {
    firstName?: string;
    lastName?: string;
    password: string;
    confirmPassword: string;
    code: string;
};

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

    const locale = useLocale();
    const t = useTranslations('Auth');

    // ساخت schema با استفاده از t
    const schema = z
        .object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            password: z
                .string()
                .min(8, { message: t('passwordMin') })
                .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: t('passwordRule') }),
            confirmPassword: z
                .string()
                .min(8, { message: t('confirmPasswordMin') })
                .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: t('confirmPasswordRule') }),
            code: z.string().length(5, { message: t('smsCodeLength') })
        })
        .refine((d) => d.password === d.confirmPassword, {
            path: ["confirmPassword"],
            message: t('passwordMismatch'),
        });

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
            // استفاده از پیام ترجمه شده از response یا پیام پیش‌فرض
            const successMessage = res.message || "SMS sent successfully";
            toast.success(successMessage);
            startTimer();
        } catch (err: any) {
            console.error("خطا در ارسال اس‌ام‌اس:", err);
            setSmsSent(false);
            // استفاده از پیام خطا از API یا پیام پیش‌فرض ترجمه شده
            const errorMessage = err.message || t('unknownError');
            toast.error(errorMessage);
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
            if (res?.id) {
                toast.success(t('successRegister'));
                setStep("assign-player");
            }
        } catch (err: any) {
            if (err?.status === 400) {
                toast.error(t('invalidPasswordOrCode'));
            } else if (err?.status === 409) {
                toast.error(t('phoneAlreadyExists'));
            } else {
                toast.error(t('unknownError'));
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
                            <FormLabel>{t('firstName')}</FormLabel>
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
                            <FormLabel>{t('lastName')}</FormLabel>
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
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>{t('password')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        className={locale === 'fa' ? 'pl-10' : 'pr-10'}
                                        style={fieldState.invalid ? { borderColor: '#ff6467' } : {}}
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
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>{t('confirmPassword')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirm ? "text" : "password"}
                                        className={locale === 'fa' ? 'pl-10' : 'pr-10'}
                                        style={fieldState.invalid ? { borderColor: '#ff6467' } : {}}
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
                            <FormLabel>{t('smsCode')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full cursor-pointer">
                    {t('submit')}
                </Button>

                <div className="mt-2">
                    {t('smsSentTo')} <span className="font-bold"> {phone} </span> {t('smsSentSuffix')}
                </div>

                <div className="mt-2">
                    {t('wrongPhone')}{" "}
                    <span
                        className="font-bold text-app-orange cursor-pointer"
                        onClick={() => {
                            form.reset();
                            setStep('phone');
                        }}
                    >
                        {t('edit')}
                    </span>
                </div>

                <div className="mt-2">
                    {timer > 0 ? (
                        <p className="text-gray-500">
                            {t('resendTimer')} {formatTime(timer)}
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={sendSms}
                            className="text-app-orange cursor-pointer"
                            disabled={loadingSms}
                        >
                            {t('resendSms')}
                        </button>
                    )}
                </div>
            </form>
        </Form>
    );
}