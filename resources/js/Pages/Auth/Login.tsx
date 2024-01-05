import React from 'react';
import GuestLayout from '@/Layouts/guest-layout';
import {Head, router} from '@inertiajs/react';
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {Input} from "@/Components/ui/input";
import {Button} from "@/Components/ui/button";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Votre nom est requis",
    }).max(255, "Votre nom est trop long"),
})

export default function Login({ status }: { status?: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route('login'), values, {
            onSuccess: () => {
                form.reset()
            }
        })
    }

    return (
        <GuestLayout>
            <Head title="Connexion" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="flex">
                                        <Input {...field} className="rounded-r-none"/>
                                        <div className="text-sm flex items-center px-3 py-1 border-l-0 border boder-input">@glanum.com</div>
                                    </div>

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-center mt-4">
                        <Button type="submit">
                            Envoyer un code de connexion
                        </Button>
                    </div>
                </form>
            </Form>
        </GuestLayout>
    );
}
