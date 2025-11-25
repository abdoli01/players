"use client";

import { useMemo } from "react";
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

const createRegisterSchema = (messages: {
    firstName: { required: string; minLength: string; persian: string };
    lastName: { required: string; minLength: string; persian: string };
}) =>
    z.object({
        firstName: z
            .string()
            .min(1, messages.firstName.required)
            .min(2, messages.firstName.minLength)
            .regex(/^[\u0600-\u06FF\s]+$/, messages.firstName.persian),
        lastName: z
            .string()
            .min(1, messages.lastName.required)
            .min(2, messages.lastName.minLength)
            .regex(/^[\u0600-\u06FF\s]+$/, messages.lastName.persian),
    });

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

interface RegisterStepProps {
    phone: string;
}

export default function RegisterStep({ phone }: RegisterStepProps) {
    const t = useTranslations();

    const registerSchema = useMemo(
        () =>
            createRegisterSchema({
                firstName: {
                    required: t('auth.login.register.firstName.required'),
                    minLength: t('auth.login.register.firstName.minLength'),
                    persian: t('auth.login.register.firstName.persian'),
                },
                lastName: {
                    required: t('auth.login.register.lastName.required'),
                    minLength: t('auth.login.register.lastName.minLength'),
                    persian: t('auth.login.register.lastName.persian'),
                },
            }),
        [t]
    );

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        alert(t('auth.login.register.success', { firstName: values.firstName, lastName: values.lastName }));
        console.log("Phone:", phone);
        console.log("User Data:", values);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold text-center">{t('auth.login.register.title')}</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.login.register.firstName.label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('auth.login.register.firstName.placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.login.register.lastName.label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('auth.login.register.lastName.placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        {t('auth.login.register.submit')}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
