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
import {authService, smsService} from "@/services/auth";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { ArrowLeft } from "lucide-react";
import {toast} from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useLocale } from 'next-intl';


const schema = z.object({
    password: z
        .string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d).+$/,
            "رمز عبور باید شامل حداقل یک حرف و یک عدد باشد"
        ),
});

type FormValues = z.infer<typeof schema>;

interface LoginStepProps {
    userMeta: { phone?: string; hasPlayerAssignment?: boolean };
    setStep: (s: Step) => void;
    phone: string;
}

export default function LoginStep({
                                      userMeta,
                                      setStep,
                                      phone,
                                  }: LoginStepProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const locale = useLocale(); // 'fa' | 'en'


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

            setStep(
                userMeta.hasPlayerAssignment ? "assign-player" : "assign-player"
            );
        } catch (err: any) {
            if (err?.status === 401){}
            else{}
        } finally {
            setLoading(false);
        }
    };

    const sendSms = async () => {
        try {
            await smsService.sendReset(phone);
            toast.success("اس‌ام‌اس با موفقیت ارسال شد!");
            setStep("reset-password")
        } catch {
            toast.error("ارسال اس‌ام‌اس موفق نبود!");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* 🔙 دکمه برگشت */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setStep("phone")}
                >
                    <ArrowLeft size={20} />
                </div>


                <FormField
                    name="password"
                    control={form.control}
                    render={({ field,fieldState }) => (
                        <FormItem>
                            <FormLabel>رمز عبور</FormLabel>
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
                    {loading ? "در حال ورود..." : "ورود"}
                </Button>

                <Button
                    type="button"
                    variant="link"
                    onClick={() => sendSms()}
                    disabled={loading}
                >
                    رمز عبور خود را فراموش کرده‌ام
                </Button>
            </form>
        </Form>
    );
}
