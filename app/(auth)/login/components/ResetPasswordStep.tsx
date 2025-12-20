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
import { passwordService } from "@/services/auth";

const schema = z.object({
    code: z.string().min(4, "کد اس‌ام‌اس را وارد کنید"),
    newPassword: z
        .string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "رمز عبور باید شامل حداقل یک حرف و یک عدد باشد"),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordStep({userMeta, setStep, phone}: {
    userMeta: any;
    setStep: (s: Step) => void;
    phone: string;
}) {
    const [loadingSms, setLoadingSms] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [smsSent, setSmsSent] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: "", newPassword: "" },
    });

    useEffect(() => {
        sendSms();
    }, []);

    const sendSms = async () => {
        setLoadingSms(true);
        setError(null);
        try {
            await smsService.sendReset(phone);
            setSmsSent(true);
        } catch (err: any) {
            console.error(err);
            setError("ارسال اس‌ام‌اس موفق نبود. دوباره تلاش کنید.");
            setSmsSent(false);
        } finally {
            setLoadingSms(false);
        }
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
            setStep(userMeta.hasPlayerAssignment ? "assign-player" : "assign-player");
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
                            <FormLabel>کد اس‌ام‌اس</FormLabel>
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

                {/* ردیف دکمه‌ها */}
                <div className="flex gap-2">
                    <Button type="button" onClick={sendSms} disabled={loadingSms || loadingSubmit} className="flex-1">
                        {loadingSms ? "در حال ارسال اس‌ام‌اس..." : smsSent ? "ارسال دوباره اس‌ام‌اس" : "ارسال اس‌ام‌اس"}
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loadingSubmit}>
                        {loadingSubmit ? "در حال ذخیره..." : "ذخیره"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
