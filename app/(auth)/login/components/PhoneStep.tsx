"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Step } from "../types";


const schema = z.object({
    phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});


type FormValues = z.infer<typeof schema>;


export default function PhoneStep({ setPhone, setUserMeta, setStep }: { setPhone: any; setUserMeta: any; setStep: (s: Step) => void }) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { phone: "" },
    });


    const checkUser = async (phone: string) => {
        if (phone === "09120000000") return { exists: true, hasPlayerAssignment: false };
        return { exists: false, hasPlayerAssignment: false };
    };


    const onSubmit = async ({ phone }: FormValues) => {
        const res = await checkUser(phone);
        setPhone(phone);
        setUserMeta(res);
        setStep(res.exists ? "login" : "verify");
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>شماره موبایل</FormLabel>
                        <FormControl><Input {...field} className="text-center" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button className="w-full">ادامه</Button>
            </form>
        </Form>
    );
}