"use client";

import { useState } from "react";
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
import { authService, smsService } from "@/services/auth";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from 'next-intl';

interface LoginStepProps {
    userMeta: { phone?: string; hasPlayerAssignment?: boolean };
    setStep: (s: Step) => void;
    phone: string;
}

type FormValues = {
    password: string;
};

export default function LoginStep({
                                      userMeta,
                                      setStep,
                                      phone,
                                  }: LoginStepProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const locale = useLocale();
    const t = useTranslations('Auth');

    // ایجاد schema با دسترسی به t
    const schema = z.object({
        password: z
            .string()
            .min(8, { message: t('loginPasswordMin') })
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d).+$/,
                { message: t('loginPasswordRule') }
            ),
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { password: "" },
    });

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const response: any = await authService.login({
                username: phone,
                password: data.password,
            });

            localStorage.setItem("access_token", response.access_token);
            dispatch(setUser(response.user));

            toast.success(t('loginSuccess'));
            setStep(userMeta.hasPlayerAssignment ? "assign-player" : "assign-player");
        } catch (err: any) {
            toast.error(err.message || t('loginError'));
        } finally {
            setLoading(false);
        }
    };

    const sendSms = async () => {
        try {
            await smsService.sendReset(phone);
            toast.success(t('resetSmsSuccess'));
            setStep("reset-password");
        } catch {
            toast.error(t('resetSmsError'));
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* دکمه برگشت */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setStep("phone")}
                >
                    <ArrowLeft size={20} />
                    <span>{t('back')}</span>
                </div>

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>{t('loginPasswordLabel')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        className={locale === 'fa' ? 'pl-10' : 'pr-10'}
                                        style={fieldState.invalid ? { borderColor: '#ff6467' } : {}}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className={`absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer ${locale === 'fa' ? 'left-2' : 'right-2'}`}
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('loggingIn') : t('loginSubmit')}
                </Button>

                <Button
                    type="button"
                    variant="link"
                    onClick={sendSms}
                    disabled={loading}
                    className="w-full"
                >
                    {t('forgotPassword')}
                </Button>
            </form>
        </Form>
    );
}