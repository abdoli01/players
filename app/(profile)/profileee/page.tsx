'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useLocale, useTranslations} from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';

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

/* ----------------- schemas ----------------- */
const profileSchema = z.object({
    firstName: z.string().min(1, { message: 'نام الزامی است' }),
    lastName: z.string().min(1, { message: 'نام خانوادگی الزامی است' }),
});

const passwordSchema = z
    .object({
        oldPassword: z
            .string()
            .min(8, { message: 'رمز عبور قدیم حداقل ۸ کاراکتر باشد' })
            .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'رمز عبور باید شامل حروف و اعداد باشد' }),
        newPassword: z
            .string()
            .min(8, { message: 'رمز عبور جدید حداقل ۸ کاراکتر باشد' })
            .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'رمز عبور جدید باید شامل حروف و اعداد باشد' }),
        confirmPassword: z.string().min(1, { message: 'تکرار رمز عبور الزامی است' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'رمزهای عبور مطابقت ندارند',
        path: ['confirmPassword'],
    });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const t = useTranslations('profile'); // کلید translation باید در messages.json باشه
    const [editProfile, { isLoading: profileLoading }] = useEditProfileMutation();
    const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();

    const locale = useLocale();


    const profileForm = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: '', lastName: '' },
    });

    const passwordForm = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* ---------- handlers ---------- */
    const onProfileSubmit = async (data: ProfileForm) => {
        try {
            await editProfile(data).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const onPasswordSubmit = async (data: PasswordForm) => {
        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            }).unwrap();
            passwordForm.reset();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 grid gap-6">

            {/* ---------- Edit Profile ---------- */}
            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <h2 className="text-lg font-semibold">{t('editProfile')}</h2>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="grid gap-4">
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
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="grid gap-4">

                            {/* old password */}
                            <FormField
                                control={passwordForm.control}
                                name="oldPassword"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t('oldPassword')}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showOldPassword ? 'text' : 'password'}
                                                    className="pr-10"
                                                    disabled={passwordLoading}
                                                    style={fieldState.invalid ? { borderColor: '#ff6467' } : {}}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOldPassword((p) => !p)}
                                                    className={`absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer ${locale === 'fa' ? 'left-2' : 'right-2'}`}
                                                    disabled={passwordLoading}
                                                >
                                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* new password */}
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t('newPassword')}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    className="pr-10"
                                                    disabled={passwordLoading}
                                                    style={fieldState.invalid ? { borderColor: '#ff6467' } : {}}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword((p) => !p)}
                                                    className={`absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer ${locale === 'fa' ? 'left-2' : 'right-2'}`}
                                                    disabled={passwordLoading}
                                                >
                                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* confirm password */}
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t('confirmPassword')}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    className="pr-10"
                                                    disabled={passwordLoading}
                                                    style={fieldState.invalid ? { borderColor: '#ff6467' } : {}}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword((p) => !p)}
                                                    className={`absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer ${locale === 'fa' ? 'left-2' : 'right-2'}`}
                                                    disabled={passwordLoading}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
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
