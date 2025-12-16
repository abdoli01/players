"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Step } from "../types";


const schema = z.object({
    password: z.string().min(6, "حداقل ۶ کاراکتر"),
});


type FormValues = z.infer<typeof schema>;


export default function LoginStep({ userMeta, setStep }: { userMeta: any; setStep: (s: Step) => void }) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { password: "" },
    });


    const onSubmit = () => {
        setStep(userMeta.hasPlayerAssignment ? "assign-player" : "assign-player");
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="password" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>رمز عبور</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button className="w-full">ورود</Button>
                <Button type="button" variant="link" onClick={() => setStep("verify")}>
                    رمز عبور را فراموش کرده‌ام
                </Button>
            </form>
        </Form>
    );
}