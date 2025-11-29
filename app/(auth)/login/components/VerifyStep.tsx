"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from '@/store/hooks'
import { setPhone } from '@/store/slices/userSlice'
const verifySchema = z.object({
    token: z
        .string()
        .min(1, "کد تایید الزامی است")
        .length(6, "کد تایید باید 6 رقم باشد")
        .regex(/^\d+$/, "کد تایید باید فقط عدد باشد"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

interface VerifyStepProps {
    phone: string;
    token: string;
    setToken: (value: string) => void;
    isRegistered: boolean;
    setStep: (value: "phone" | "verify" | "register") => void;
}

export default function VerifyStep({
    phone,
    token,
    setToken,
    isRegistered,
    setStep,
}: VerifyStepProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(!isRegistered);
    const dispatch = useAppDispatch()
    const form = useForm<VerifyFormValues>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            token: token || "",
        },
    });

    const sendSms = async () => {
        setLoading(true);
        setTimeout(() => {
            setSent(true);
            setLoading(false);
            alert("کد جدید ارسال شد");
        }, 700);
    };

    const onSubmit = async (values: VerifyFormValues) => {
        if (values.token !== "123456") {
            form.setError("token", {
                type: "manual",
                message: "کد اشتباه است",
            });
            return;
        }

        setToken(values.token);

        if (isRegistered) {
            alert("ورود موفقیت‌آمیز");
            dispatch(setPhone(phone))
        } else {
            setStep("register");
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold text-center">کد تایید</h1>

            <p className="text-center text-sm text-muted-foreground">
                {isRegistered
                    ? "اگر کد قبلی را داری وارد کن. اگر نداری، ارسال مجدد را بزن."
                    : `کد برای ${phone} ارسال شد.`}
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>کد تایید</FormLabel>
                                <FormControl>
                                    <Input
                                        maxLength={6}
                                        placeholder="123456"
                                        className="text-center"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        تایید
                    </Button>
                </form>
            </Form>

            <Button
                variant="outline"
                onClick={sendSms}
                disabled={loading}
                className="w-full"
            >
                {loading ? "در حال ارسال..." : "ارسال دوباره کد"}
            </Button>
        </div>
    );
}
