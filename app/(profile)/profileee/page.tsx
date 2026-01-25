'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

import {
    useEditProfileMutation,
    useChangePasswordMutation,
} from '@/services/api/usersApi';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

/* ---------------- schemas (بدون export) ---------------- */
const profileSchema = z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
});

const passwordSchema = z
    .object({
        oldPassword: z.string().min(1, 'Required'),
        newPassword: z.string().min(8, 'Min 8 characters'),
        confirmPassword: z.string().min(1, 'Required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const t = useTranslations('profile');

    const [editProfile, { isLoading: profileLoading }] =
        useEditProfileMutation();
    const [changePassword, { isLoading: passwordLoading }] =
        useChangePasswordMutation();

    const profileForm = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: '', lastName: '' },
    });

    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    });

    /* ---------- handlers ---------- */
    const onProfileSubmit = async (data: ProfileForm) => {
        try {
            await editProfile(data).unwrap();
        } catch (e) {
            console.error(e);
        }
    };

    const onPasswordSubmit = async (data: PasswordForm) => {
        try {
            await changePassword(data).unwrap();
            passwordForm.reset();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 grid gap-6">

            {/* -------- profile box -------- */}
            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <h2 className="text-lg font-semibold">{t('editProfile')}</h2>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form
                            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                            className="grid gap-4"
                        >
                            <FormField
                                control={profileForm.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('firstName')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={profileForm.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('lastName')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={profileLoading}>
                                {t('saveChanges')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* -------- change password box -------- */}
            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <h2 className="text-lg font-semibold">{t('changePassword')}</h2>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form
                            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                            className="grid gap-4"
                        >
                            <FormField
                                control={passwordForm.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('oldPassword')}</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('newPassword')}</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('confirmPassword')}</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={passwordLoading}>
                                {t('changePassword')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
