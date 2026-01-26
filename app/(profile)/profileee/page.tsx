'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/userSlice';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';



import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

import { useEditProfileMutation, useChangePasswordMutation } from '@/services/api/usersApi';
import { useAppSelector } from '@/store/hooks';

export default function ProfilePage() {
    const t = useTranslations('profile');
    const locale = useLocale();
    const router = useRouter();

    const dispatch = useAppDispatch();


    /* ---------- redux ---------- */
    const user = useAppSelector((s) => s.user.user);
    const hydrated = useAppSelector((s) => s.user.hydrated);

    /* ---------- api ---------- */
    const [editProfile, { isLoading: profileLoading }] = useEditProfileMutation();
    const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();

    /* ---------- schemas ---------- */
    const profileSchema = useMemo(
        () =>
            z.object({
                firstName: z.string().min(1, { message: t('firstNameRequired') }),
                lastName: z.string().min(1, { message: t('lastNameRequired') }),
            }),
        [t]
    );

    const passwordSchema = useMemo(
        () =>
            z
                .object({
                    oldPassword: z
                        .string()
                        .min(8, { message: t('passwordMin') })
                        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
                            message: t('passwordRule'),
                        }),
                    newPassword: z
                        .string()
                        .min(8, { message: t('passwordMin') })
                        .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
                            message: t('passwordRule'),
                        }),
                    confirmPassword: z.string().min(1, {
                        message: t('confirmPasswordRequired'),
                    }),
                })
                .refine((d) => d.newPassword === d.confirmPassword, {
                    message: t('passwordsNotMatch'),
                    path: ['confirmPassword'],
                }),
        [t]
    );

    type ProfileForm = z.infer<typeof profileSchema>;
    type PasswordForm = z.infer<typeof passwordSchema>;

    /* ---------- forms ---------- */
    const profileForm = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: '', lastName: '' },
    });

    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    /* ---------- prefill profile ---------- */
    useEffect(() => {
        if (hydrated && user) {
            profileForm.reset({
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
            });
        }
    }, [hydrated, user, profileForm]);

    /* ---------- password visibility ---------- */
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    /* ---------- handlers ---------- */
    const onProfileSubmit = async (data: ProfileForm) => {
        try {
            const updatedUser = await editProfile(data).unwrap();
            dispatch(setUser(updatedUser));
            toast.success(t('profileUpdated'));
        } catch (err: any) {
            toast.error(err?.data?.message || t('profileUpdateFailed'));
        }
    };

    const onPasswordSubmit = async (data: PasswordForm) => {
        try {
            await changePassword(data).unwrap();
            passwordForm.reset();
            toast.success(t('passwordChanged'));
        } catch (err: any) {
            toast.error(err?.data?.message || t('passwordChangeFailed'));
        }
    };

    const passwordFields = [
        { name: 'oldPassword', show: showOld, setShow: setShowOld },
        { name: 'newPassword', show: showNew, setShow: setShowNew },
        { name: 'confirmPassword', show: showConfirm, setShow: setShowConfirm },
    ] as const;

    return (
        <div className="max-w-3xl mx-auto p-6 grid gap-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex items-center">
                <Button
                    type="button"
                    variant="default"
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2"
                >
                    {locale === 'fa' ? (
                        <>
                            <ArrowRight size={18} />
                            {t('backToHome')}
                        </>
                    ) : (
                        <>
                            <ArrowLeft size={18} />
                            {t('backToHome')}
                        </>
                    )}
                </Button>
            </div>


            {/* ---------- Edit Profile ---------- */}
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

            {/* ---------- Change Password ---------- */}
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
                            {passwordFields.map(({ name, show, setShow }) => (
                                <FormField
                                    key={name}
                                    control={passwordForm.control}
                                    name={name}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>{t(name)}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={show ? 'text' : 'password'}
                                                        className={
                                                            locale === 'fa'
                                                                ? 'pl-10'
                                                                : 'pr-10'
                                                        }
                                                        disabled={passwordLoading}
                                                        style={
                                                            fieldState.invalid
                                                                ? { borderColor: '#ff6467' }
                                                                : {}
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShow((p) => !p)}
                                                        className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                                                            locale === 'fa'
                                                                ? 'left-2'
                                                                : 'right-2'
                                                        }`}
                                                        disabled={passwordLoading}
                                                    >
                                                        {show ? (
                                                            <EyeOff size={20} />
                                                        ) : (
                                                            <Eye size={20} />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

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
