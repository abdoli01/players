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
import { setUser } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

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
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const intervalRef = useRef<number | null>(null);

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
        setError(null);
        try {
            const res: any = await smsService.sendRegister(phone);
            dispatch(setUser(res.user));
            setSmsSent(true);
            toast.success("اس‌ام‌اس با موفقیت ارسال شد!");
            startTimer();
        } catch (err: any) {
            console.error("خطا در ارسال اس‌ام‌اس:", err);
            setError("ارسال اس‌ام‌اس موفق نبود. دوباره تلاش کنید.");
            setSmsSent(false);
            toast.error("ارسال اس‌ام‌اس موفق نبود!");
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
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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

                <Button type="submit" className="w-full">
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
