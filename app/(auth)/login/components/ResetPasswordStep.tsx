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
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import { toast } from "react-toastify";
import Image from "next/image";

type FormValues = {
    code: string;
    newPassword: string;
};

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

    const locale = useLocale();
    const t = useTranslations('Auth');

    const intervalRef = useRef<number | null>(null);

    const schema = z.object({
        code: z.string().length(5, { message: t('resetSmsCodeLength') }),
        newPassword: z
            .string()
            .min(8, { message: t('resetPasswordMin') })
            .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
                message: t('resetPasswordRule')
            }),
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: "", newPassword: "" },
    });

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
        setError(null);
        try {
            await smsService.sendReset(phone);
            toast.success(t('resetSmsSuccess'));
            startTimer();
        } catch {
            setError(t('resetSendError'));
            toast.error(t('resetSmsError'));
        } finally {
            setLoadingSms(false);
        }
    };

    useEffect(() => {
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
        setError(null);
        setLoadingSubmit(true);
        try {
            await passwordService.verifyReset({
                username: phone,
                code: data.code,
                newPassword: data.newPassword,
            });
            toast.success(t('resetSuccess'));
            setStep("login");
        } catch (err: any) {
            if (err?.status === 400) {
                setError(t('resetInvalidCode'));
            } else if (err?.status === 404) {
                setError(t('resetUserNotFound'));
            } else {
                setError(t('resetUnknownError'));
            }
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleBack = () => {
        setStep("login");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* دکمه برگشت */}
                <div className="flex items-center justify-between">
                    <Image
                        src="/images/logo-new.png"
                        alt="logo"
                        width={47}
                        height={56}
                        loading="eager"
                        priority
                    />
                    <div
                        className="flex items-center gap-2 cursor-pointer mb-4"
                        onClick={handleBack}
                    >
                        {locale === 'fa' ? (
                            <ArrowRight size={20} />
                        ) : (
                            <ArrowLeft size={20} />
                        )}
                        <span>{t('back')}</span>
                    </div>

                </div>

                {/*{error && (*/}
                {/*    <p className="text-red-600 text-sm text-center">{error}</p>*/}
                {/*)}*/}

                <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('resetCodeLabel')}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={loadingSubmit}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>{t('resetNewPasswordLabel')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        disabled={loadingSubmit}
                                        className={locale === 'fa' ? 'pl-10' : 'pr-10'}
                                        style={fieldState.invalid ? { borderColor: '#ff6467' } : {}}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className={`absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer ${locale === 'fa' ? 'left-2' : 'right-2'}`}
                                        tabIndex={-1}
                                        disabled={loadingSubmit}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loadingSubmit}
                >
                    {loadingSubmit ? t('resetSaving') : t('resetSave')}
                </Button>

                <div className="mt-2 text-center">
                    {timer > 0 ? (
                        <p className="text-gray-500">
                            {t('resetResendTimer')} {formatTime(timer)}
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={sendSms}
                            className="text-app-orange cursor-pointer text-sm"
                            disabled={loadingSms}
                        >
                            {t('resetResendSms')}
                        </button>
                    )}
                </div>
            </form>
        </Form>
    );
}