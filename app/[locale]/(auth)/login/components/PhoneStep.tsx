"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from 'next-intl';
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

const createPhoneSchema = (messages: { required: string; invalid: string }) =>
    z.object({
        phone: z
            .string()
            .min(1, messages.required)
            .regex(/^09\d{9}$/, messages.invalid),
    });

type PhoneFormValues = z.infer<ReturnType<typeof createPhoneSchema>>;

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
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(false);

    const phoneSchema = useMemo(
        () =>
            createPhoneSchema({
                required: t('auth.login.phone.required'),
                invalid: t('auth.login.phone.invalid'),
            }),
        [t]
    );

    const form = useForm<PhoneFormValues>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phone: phone || "",
        },
    });

    const mockCheckUser = async (phoneNumber: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(phoneNumber === "09120000000");
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
            <h1 className="text-xl font-bold text-center">{t('auth.login.title')}</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.login.phone.label')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('auth.login.phone.placeholder')}
                                        className="text-center"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? t('auth.login.phone.checking') : t('common.continue')}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
