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

const phoneSchema = z.object({
    phone: z
        .string()
        .min(1, "شماره موبایل الزامی است")
        .regex(/^09\d{9}$/, "شماره موبایل باید با 09 شروع شود و 11 رقم باشد"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

interface PhoneStepProps {
    phone: string;
    setPhone: (value: string) => void;
    setStep: (value: "phone" | "verify" | "register") => void;
    setIsRegistered: (value: boolean) => void;
}

export default function PhoneStep({
    phone,
    setPhone,
    setStep,
    setIsRegistered,
}: PhoneStepProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<PhoneFormValues>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phone: phone || "",
        },
    });

    const mockCheckUser = async (phoneNumber: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(phoneNumber === "09120000000"); // شماره تست ثبت شده
            }, 700);
        });
    };

    const onSubmit = async (values: PhoneFormValues) => {
        setLoading(true);
        const exists = await mockCheckUser(values.phone);
        setLoading(false);

        setPhone(values.phone);
        setIsRegistered(exists);
        setStep("verify");
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold text-center">ورود / ثبت ‌نام</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>شماره موبایل</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="09123456789"
                                        className="text-center"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "در حال بررسی..." : "ادامه"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
