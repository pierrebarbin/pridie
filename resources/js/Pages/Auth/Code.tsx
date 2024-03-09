import { zodResolver } from "@hookform/resolvers/zod"
import { Head, router } from "@inertiajs/react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/Components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import GuestLayout from "@/Layouts/guest-layout"

const formSchema = z.object({
    code: z
        .string()
        .min(1, {
            message: "Le code est requis",
        })
        .max(6, "Le code doit faire 6 caractères"),
})

export default function Code({
    token,
    email,
    errors,
}: {
    token: string
    email: string
    errors: any
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    })

    useEffect(() => {
        if (errors) {
            for (const [key, value] of Object.entries(errors)) {
                // @ts-ignore
                form.setError(key, { type: "custom", message: value })
            }
        }
    }, [errors])

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route("code"), {
            email,
            token,
            ...values,
        })
    }

    return (
        <GuestLayout>
            <Head title="Entrez votre code" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Le code est à 6 chiffres
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="mt-4 flex items-center justify-center">
                        <Button type="submit">Connexion</Button>
                    </div>
                </form>
            </Form>
        </GuestLayout>
    )
}
