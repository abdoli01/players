'use client';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { updateProfile, setPhone } from '@/store/slices/userSlice'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

import { sendCodesMock, verifyCodesMock } from '@/utils/smsMock'

// ------------------- Schemas -------------------
const profileSchema = z.object({
    firstName: z.string().min(1, 'نام الزامی است'),
    lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
    password: z.string().optional(),
})

const phoneSchema = z.object({
    oldPhone: z
        .string()
        .min(1, "شماره موبایل الزامی است")
        .regex(/^09\d{9}$/, "شماره موبایل باید با 09 شروع شود و 11 رقم باشد"),
    newPhone: z
        .string()
        .min(1, "شماره موبایل الزامی است")
        .regex(/^09\d{9}$/, "شماره موبایل باید با 09 شروع شود و 11 رقم باشد"),
    oldCode: z.string().optional(),
    newCode: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>
type PhoneForm = z.infer<typeof phoneSchema>

export default function ProfilePage() {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((s: RootState) => s.user)

    const profileForm = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: user.firstName, lastName: user.lastName, password: user.password },
    })

    const phoneForm = useForm<PhoneForm>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { oldPhone: user.phone, newPhone: '', oldCode: '', newCode: '' },
    })

    const [phoneStage, setPhoneStage] = useState<'enter' | 'verify'>('enter')
    const [loading, setLoading] = useState(false)

    // ---------------- Profile Submit ----------------
    const onProfileSubmit = (data: ProfileForm) => {
        setLoading(true)
        try {
            dispatch(updateProfile({ firstName: data.firstName, lastName: data.lastName }))
        } finally {
            setLoading(false)
        }
    }

    // ---------------- Phone Handlers ----------------
    const handleSendCodes = (data: PhoneForm) => {
        setLoading(true)
        const codes = sendCodesMock(data.oldPhone, data.newPhone)
        console.log('[DEV] codes', codes)
        setPhoneStage('verify')
        setLoading(false)
    }

    const handleVerify = (data: PhoneForm) => {
        setLoading(true)
        const res = verifyCodesMock(data.oldPhone, data.newPhone, data.oldCode!, data.newCode!)
        if (res.ok) {
            dispatch(setPhone(data.newPhone))
            setPhoneStage('enter')
            phoneForm.reset({ oldPhone: data.newPhone, newPhone: '', oldCode: '', newCode: '' })
        } else {
            phoneForm.setError('oldCode', { message: res.error === 'expired' ? 'کد منقضی شده' : 'کد اشتباه است' })
            phoneForm.setError('newCode', { message: res.error === 'expired' ? 'کد منقضی شده' : 'کد اشتباه است' })
        }
        setLoading(false)
    }

    return (
        <div className="max-w-3xl mx-auto p-6 grid gap-6">

            {/* ---------- Profile Card ---------- */}
            <Card className="rounded-2xl shadow-lg p-4">
                <CardHeader>
                    <h2 className="text-xl font-semibold">ویرایش پروفایل</h2>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="grid gap-4">
                            <FormField
                                control={profileForm.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نام</FormLabel>
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
                                        <FormLabel>نام خانوادگی</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={profileForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رمز عبور جدید</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="اختیاری" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={loading}>ذخیره تغییرات</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* ---------- Phone Card ---------- */}
            <Card className="rounded-2xl shadow-lg p-4">
                <CardHeader>
                    <h2 className="text-xl font-semibold">تغییر شماره موبایل</h2>
                </CardHeader>
                <CardContent>
                    <Form {...phoneForm}>
                        <form
                            onSubmit={phoneForm.handleSubmit(phoneStage === 'enter' ? handleSendCodes : handleVerify)}
                            className="grid gap-4"
                        >
                            {phoneStage === 'enter' && (
                                <>
                                    <FormField
                                        control={phoneForm.control}
                                        name="oldPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>شماره فعلی</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={phoneForm.control}
                                        name="newPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>شماره جدید</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={loading}>ارسال کد تأیید</Button>
                                </>
                            )}

                            {phoneStage === 'verify' && (
                                <>
                                    <FormField
                                        control={phoneForm.control}
                                        name="oldCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>کد تأیید شماره فعلی</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={phoneForm.control}
                                        name="newCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>کد تأیید شماره جدید</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={loading}>تایید و تغییر شماره</Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => { setPhoneStage('enter'); phoneForm.reset({ oldPhone: user.phone, newPhone: '', oldCode: '', newCode: '' }) }}
                                        >
                                            انصراف
                                        </Button>
                                    </div>
                                </>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
