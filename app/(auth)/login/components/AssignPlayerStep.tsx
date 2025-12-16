"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";


const schema = z.object({ player: z.string().min(1, "انتخاب الزامی") });


type FormValues = z.infer<typeof schema>;


export default function AssignPlayerStep() {
    const router = useRouter();
    const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { player: "" } });


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => router.push("/"))} className="space-y-4">
                <FormField name="player" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>نقش بازیکن</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="gk">دروازه‌بان</SelectItem>
                                <SelectItem value="df">مدافع</SelectItem>
                                <SelectItem value="mf">هافبک</SelectItem>
                                <SelectItem value="fw">مهاجم</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button className="w-full">تایید</Button>
            </form>
        </Form>
    );
}