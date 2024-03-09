import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import GuestLayout from "@/Layouts/guest-layout";

const formSchema = z.object({
    email: z
        .string()
        .email()
        .max(255, "Votre nom est trop long"),
});

export default function Login({ status }: { status?: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route("login"), values, {
            onSuccess: () => {
                form.reset();
            },
        });
    }

    return (
        <GuestLayout>
            <Head title="Connexion" />

            {status ? (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            ) : null}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="flex">
                                        <Input
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="mt-4 flex items-center justify-center">
                        <Button type="submit">
                            Envoyer un code de connexion
                        </Button>
                    </div>
                </form>
            </Form>
        </GuestLayout>
    );
}
