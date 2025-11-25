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

const createVerifySchema = (messages: { required: string; length: string; numeric: string }) =>
    z.object({
        token: z
            .string()
            .min(1, messages.required)
            .length(6, messages.length)
            .regex(/^\d+$/, messages.numeric),
    });

type VerifyFormValues = z.infer<ReturnType<typeof createVerifySchema>>;

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
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(!isRegistered);

    const verifySchema = useMemo(
        () =>
            createVerifySchema({
                required: t('auth.login.verify.code.required'),
                length: t('auth.login.verify.code.length'),
                numeric: t('auth.login.verify.code.numeric'),
            }),
        [t]
    );

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
            alert(t('auth.login.verify.sent'));
        }, 700);
    };

    const onSubmit = async (values: VerifyFormValues) => {
        if (values.token !== "123456") {
            form.setError("token", {
                type: "manual",
                message: t('auth.login.verify.code.wrong'),
            });
            return;
        }

        setToken(values.token);

        if (isRegistered) {
            alert(t('auth.login.verify.success'));
        } else {
            setStep("register");
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold text-center">{t('auth.login.verify.title')}</h1>

            <p className="text-center text-sm text-muted-foreground">
                {isRegistered
                    ? t('auth.login.verify.messageRegistered')
                    : t('auth.login.verify.messageNew', { phone })}
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('auth.login.verify.code.label')}</FormLabel>
                                <FormControl>
                                    <Input
                                        maxLength={6}
                                        placeholder={t('auth.login.verify.code.placeholder')}
                                        className="text-center"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        {t('common.submit')}
                    </Button>
                </form>
            </Form>

            <Button
                variant="outline"
                onClick={sendSms}
                disabled={loading}
                className="w-full"
            >
                {loading ? t('auth.login.verify.sending') : t('auth.login.verify.resend')}
            </Button>
        </div>
    );
}
