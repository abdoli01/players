"use client";

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
import { authService } from "@/services/auth";

const schema = z.object({
    phone: z
        .string()
        .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    setPhone: (phone: string) => void;
    setUserMeta: (meta: { exists: boolean }) => void;
    setStep: (step: Step) => void;
}

export default function PhoneStep({
                                      setPhone,
                                      setUserMeta,
                                      setStep,
                                  }: Props) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { phone: "" },
    });

    const onSubmit = async ({ phone }: FormValues) => {
        try {
            const res = await authService.checkUsername({
                username: phone,
            });

            setPhone(phone);
            setUserMeta(res);

            // تصمیم جریان
            if (res.exists) {
                setStep("login");
            } else {
                setStep("verify");
            }
        } catch (error: any) {
            form.setError("phone", {
                message: error?.message || "خطا در بررسی شماره",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>شماره موبایل</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="text-center"
                                    placeholder="09123456789"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" type="submit">
                    ادامه
                </Button>
            </form>
        </Form>
    );
}
