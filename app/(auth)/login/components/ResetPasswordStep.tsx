"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Step } from "../types";


const schema = z.object({
    password: z.string().min(6),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "عدم تطابق" });


type FormValues = z.infer<typeof schema>;


export default function ResetPasswordStep({ userMeta, setStep }: { userMeta: any; setStep: (s: Step) => void }) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { password: "", confirmPassword: "" },
    });


    const onSubmit = () => setStep(userMeta.hasPlayerAssignment ? "assign-player" : "assign-player");


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="password" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>رمز جدید</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>تکرار رمز</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button className="w-full">ذخیره</Button>
            </form>
        </Form>
    );
}