"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Step } from "../types";
import { authService } from "@/services/auth";

const schema = z.object({
    password: z
        .string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "رمز عبور باید شامل حداقل یک حرف و یک عدد باشد"),
});

type FormValues = z.infer<typeof schema>;

interface LoginStepProps {
    userMeta: { phone: string; hasPlayerAssignment?: boolean };
    setStep: (s: Step) => void;
    phone: string;
}

export default function LoginStep({ userMeta, setStep, phone }: LoginStepProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { password: "" },
    });

    const onSubmit = async (data: FormValues) => {
        setError(null);
        setLoading(true);
        try {
            await authService.login({ username: phone, password: data.password });
            setStep(userMeta.hasPlayerAssignment ? "assign-player" : "assign-player");
        } catch (err: any) {
            if (err?.status === 401) setError("شماره همراه یا رمز عبور اشتباه است");
            else setError("خطای ناشناخته رخ داد");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && <p className="text-red-600">{error}</p>}

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>رمز عبور</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} disabled={loading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "در حال ورود..." : "ورود"}
                </Button>

                <Button type="button" variant="link" onClick={() => setStep("verify")} disabled={loading}>
                    رمز عبور خود را فراموش کرده‌ام
                </Button>
            </form>
        </Form>
    );
}
