"use client";

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

const registerSchema = z.object({
    firstName: z
        .string()
        .min(1, "نام الزامی است")
        .min(2, "نام باید حداقل 2 کاراکتر باشد")
        .regex(/^[\u0600-\u06FF\s]+$/, "نام باید فارسی باشد"),
    lastName: z
        .string()
        .min(1, "نام خانوادگی الزامی است")
        .min(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد")
        .regex(/^[\u0600-\u06FF\s]+$/, "نام خانوادگی باید فارسی باشد"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterStepProps {
    phone: string;
}

export default function RegisterStep({ phone }: RegisterStepProps) {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        // در اینجا می‌توانید API call برای ثبت نام انجام دهید
        alert(`ثبت نام شد: ${values.firstName} ${values.lastName}`);
        console.log("Phone:", phone);
        console.log("User Data:", values);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold text-center">ثبت نام جدید</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>نام</FormLabel>
                                <FormControl>
                                    <Input placeholder="نام" {...field} />
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
                                <FormLabel>نام خانوادگی</FormLabel>
                                <FormControl>
                                    <Input placeholder="نام خانوادگی" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        ثبت نام
                    </Button>
                </form>
            </Form>
        </div>
    );
}
